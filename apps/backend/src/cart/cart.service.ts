import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUser(userId: number): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { userId },
      relations: ['variant', 'variant.product', 'variant.product.images'],
    });
  }

  async addItem(
    userId: number,
    variantId: number,
    quantity: number,
  ): Promise<CartItem> {
    const existingItem = await this.cartItemRepository.findOne({
      where: { userId, variantId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      return this.cartItemRepository.save(existingItem);
    }

    const newItem = this.cartItemRepository.create({
      userId,
      variantId,
      quantity,
    });

    return this.cartItemRepository.save(newItem);
  }

  async updateQuantity(
    userId: number,
    variantId: number,
    quantity: number,
  ): Promise<CartItem | null> {
    const item = await this.cartItemRepository.findOne({
      where: { userId, variantId },
    });

    if (!item) return null;

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
      return null;
    }

    item.quantity = quantity;
    return this.cartItemRepository.save(item);
  }

  async removeItem(userId: number, variantId: number): Promise<void> {
    await this.cartItemRepository.delete({ userId, variantId });
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartItemRepository.delete({ userId });
  }
}
