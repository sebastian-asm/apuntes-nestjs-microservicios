import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

import { PaymentsService } from './payments.service'
import { PaymentSessionDto } from './dto'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
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
