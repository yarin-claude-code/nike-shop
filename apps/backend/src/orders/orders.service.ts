import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';

interface CreateOrderDto {
  shippingAddress: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
  ) {}

  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(userId: number, data: CreateOrderDto): Promise<Order> {
    const cartItems = await this.cartService.findByUser(userId);

    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.variant.product.salePrice) ||
          Number(item.variant.product.price)) *
          item.quantity,
      0,
    );
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order
    const order = this.orderRepository.create({
      userId,
      status: OrderStatus.PENDING,
      subtotalAmount: subtotal,
      shippingAmount: shipping,
      taxAmount: tax,
      totalAmount: total,
      shippingAddress: data.shippingAddress,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = cartItems.map((item) =>
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice:
          Number(item.variant.product.salePrice) ||
          Number(item.variant.product.price),
        productName: item.variant.product.name,
        size: item.variant.size,
        color: item.variant.color,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    // Clear cart
    await this.cartService.clearCart(userId);

    return this.findById(savedOrder.id, userId);
  }
}
