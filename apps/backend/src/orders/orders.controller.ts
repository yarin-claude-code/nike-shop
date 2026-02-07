import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString } from 'class-validator';
import { OrdersService } from './orders.service';

interface AuthenticatedRequest {
  user: {
    id: number;
    email: string;
  };
}

class CreateOrderDto {
  @IsString()
  shippingAddress: string;
}

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.ordersService.findById(parseInt(id, 10), req.user.id);
  }

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }
}
