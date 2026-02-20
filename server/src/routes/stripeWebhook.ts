import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10' as any,
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const metadataItems = JSON.parse(session.metadata?.itemsJson || '[]');

            // Create order
            const order = await prisma.order.create({
                data: {
                    stripeSessionId: session.id,
                    customerEmail: session.customer_details?.email || 'unknown@example.com',
                    currency: session.currency?.toUpperCase() || 'USD',
                    totalAmount: (session.amount_total || 0) / 100,
                    status: 'COMPLETED',
                    items: {
                        create: metadataItems.map((item: any) => ({
                            productId: item.productId,
                            productName: item.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                        }))
                    }
                },
                include: { items: true }
            });

            // Update stock for physical products
            for (const item of metadataItems) {
                if (item.type === 'PHYSICAL') {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity }
                        }
                    });
                }
            }

            // Send email receipt
            const emailHtml = `
        <h1>Thank you for your order!</h1>
        <p>Order ID: ${order.id}</p>
        <p>Total: ${order.totalAmount} ${order.currency}</p>
        <h2>Items:</h2>
        <ul>
          ${order.items.map(item => `<li>${item.quantity}x ${item.productName} - ${item.unitPrice}</li>`).join('')}
        </ul>
      `;

            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: order.customerEmail,
                    subject: 'Your Marketplace Order Confirmation',
                    html: emailHtml,
                });
            } catch (emailErr) {
                console.error('Failed to send confirmation email', emailErr);
            }

        } catch (dbError) {
            console.error('Database error processing webhook:', dbError);
            return res.status(500).end();
        }
    }

    res.json({ received: true });
});

export default router;
