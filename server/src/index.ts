import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import stripeWebhookRoute from './routes/stripeWebhook.js';

// Stripe webhook requires raw body, so mount it before express.json()
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhookRoute);

// General middleware limit
app.use(express.json());

// Main Routes
app.use('/api/admin', authRoutes); // /api/admin/login
app.use('/api/products', productRoutes);
app.use('/api/admin/products', productRoutes); // Handled inside productRoutes with authMiddleware
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes); // /api/stripe/checkout

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Marketplace API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
