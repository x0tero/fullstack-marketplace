import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all orders (Admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: true,
            }
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin Dashboard Summary
router.get('/summary', requireAuth, requireAdmin, async (req, res) => {
    try {
        const totalProducts = await prisma.product.count();
        const totalOrders = await prisma.order.count();

        // Calculate total revenue
        const result = await prisma.order.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                status: 'COMPLETED'
            }
        });

        res.json({
            totalProducts,
            totalOrders,
            totalRevenue: result._sum.totalAmount || 0,
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary data' });
    }
});

export default router;
