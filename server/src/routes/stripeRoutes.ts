import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10' as any,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use a custom SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// POST /api/stripe/checkout
router.post('/checkout', async (req, res) => {
    try {
        const { items, currency, customerEmail } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const lineItems = items.map((item: any) => {
            // Stripe expects amounts in cents
            const unitAmount = Math.round(item.unitPrice * 100);
            return {
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: item.name,
                        images: item.thumbnail ? [item.thumbnail] : [],
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                itemsJson: JSON.stringify(items.map((i: any) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    name: i.name,
                    type: i.type,
                }))),
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

export default router;
