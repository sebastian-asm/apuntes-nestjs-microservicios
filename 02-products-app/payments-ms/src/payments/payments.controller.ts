import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Request, Response } from 'express'

import { PaymentsService } from './payments.service'
import { PaymentSessionDto } from './dto'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create.payment.session')
  createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto)
  }

  @Get('success')
  success() {
    return 'success'
  }

  @Get('cancel')
  cancel() {
    return 'cancel'
  }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res)
  }
}
