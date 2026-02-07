import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNumber, Min } from 'class-validator';
import { CartService } from './cart.service';

interface AuthenticatedRequest {
  user: {
    id: number;
    email: string;
  };
}

class AddItemDto {
  @IsNumber()
  variantId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

class UpdateQuantityDto {
  @IsNumber()
  quantity: number;
}

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req: AuthenticatedRequest) {
    return this.cartService.findByUser(req.user.id);
  }

  @Post('items')
  async addItem(
    @Request() req: AuthenticatedRequest,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.addItem(
      req.user.id,
      addItemDto.variantId,
      addItemDto.quantity,
    );
  }

  @Put('items/:variantId')
  async updateQuantity(
    @Request() req: AuthenticatedRequest,
    @Param('variantId') variantId: string,
    @Body() updateDto: UpdateQuantityDto,
  ) {
    return this.cartService.updateQuantity(
      req.user.id,
      parseInt(variantId, 10),
      updateDto.quantity,
    );
  }

  @Delete('items/:variantId')
  async removeItem(
    @Request() req: AuthenticatedRequest,
    @Param('variantId') variantId: string,
  ) {
    await this.cartService.removeItem(req.user.id, parseInt(variantId, 10));
    return { success: true };
  }

  @Delete()
  async clearCart(@Request() req: AuthenticatedRequest) {
    await this.cartService.clearCart(req.user.id);
    return { success: true };
  }
}
