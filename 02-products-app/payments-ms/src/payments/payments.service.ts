import { Injectable } from '@nestjs/common'
import { Response, Request } from 'express'
import Stripe from 'stripe'

import { envs } from 'src/config'
import { PaymentSessionDto } from './dto'

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret)

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto
    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }))

    return await this.stripe.checkout.sessions.create({
      payment_intent_data: { metadata: { orderId } },
      line_items,
      mode: 'payment',
      success_url: envs.stripeSuccessURl,
      cancel_url: envs.stripeCancelUrl
    })
  }

  async stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature']
    const endpointSecret = envs.stripeEndpointSecret
    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(req['rawBody'], signature, endpointSecret)
    } catch (error) {
      console.log(error)
      return res.status(400).send(`Webhook error: ${error.message}`)
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object
        console.log({ metadata: chargeSucceeded.metadata })
        break
      default:
        console.log(`Event ${event.type} not handled`)
    }

    return res.status(200).json({ signature })
  }
}
