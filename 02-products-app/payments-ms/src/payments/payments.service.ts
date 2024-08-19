import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Response, Request } from 'express'
import Stripe from 'stripe'

import { envs, NATS_SERVICE } from 'src/config'
import { PaymentSessionDto } from './dto'

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret)

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

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

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: { metadata: { orderId } },
      line_items,
      mode: 'payment',
      success_url: envs.stripeSuccessURl,
      cancel_url: envs.stripeCancelUrl
    })

    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url
    }
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
        const payload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url
        }
        // emit solo envía, no espera una respuesta
        this.client.emit('payment.succeeded', payload)
        break
      default:
        console.log(`Event ${event.type} not handled`)
    }

    return res.status(200).json({ signature })
  }
}
