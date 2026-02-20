import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Post a review (Public)
router.post('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { reviewerName, rating, comment } = req.body;

        if (!reviewerName || !rating || !comment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if product exists
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const review = await prisma.review.create({
            data: {
                productId,
                reviewerName,
                rating: Number(rating),
                comment,
            }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;
