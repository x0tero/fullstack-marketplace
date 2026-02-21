import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../services/uploadService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const { search, tag, sort } = req.query;

        const searchStr = search as string | undefined;
        const tagStr = tag as string | undefined;

        const where: Prisma.ProductWhereInput = {};
        if (searchStr) {
            where.OR = [
                { name: { contains: searchStr, mode: 'insensitive' } },
                { description: { contains: searchStr, mode: 'insensitive' } }
            ];
        }
        if (tagStr) {
            where.tags = { has: tagStr };
        }

        const orderBy: Prisma.ProductOrderByWithRelationInput = {};
        if (sort === 'price_asc') orderBy.price = 'asc';
        else if (sort === 'price_desc') orderBy.price = 'desc';
        else orderBy.createdAt = 'desc';

        const products = await prisma.product.findMany({
            where,
            orderBy,
            include: {
                reviews: {
                    select: { rating: true }
                }
            }
        });

        // Calculate average rating
        const expandedProducts = products.map(product => {
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length
                : 0;

            return {
                ...product,
                avgRating,
            }
        });

        res.json(expandedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product (Public)
router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id as string },
            include: { reviews: { orderBy: { createdAt: 'desc' } } }
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Admin: Create product
router.post('/', requireAuth, requireAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, type, price, currency, stock, tags } = req.body;
        const files = req.files as Express.Multer.File[];
        const imageUrls = files?.map(f => f.path) || [];

        const product = await prisma.product.create({
            data: {
                name,
                description,
                type,
                price: parseFloat(price),
                currency,
                stock: type === 'PHYSICAL' ? parseInt(stock) : null,
                tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
                images: imageUrls,
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Admin: Update product
router.put('/:id', requireAuth, requireAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, type, price, currency, stock, tags } = req.body;
        const files = req.files as Express.Multer.File[];

        const updateData: any = {
            name,
            description,
            type,
            price: price ? parseFloat(price) : undefined,
            currency,
            stock: type === 'PHYSICAL' ? parseInt(stock) : null,
        };

        if (tags) {
            if (Array.isArray(tags)) {
                updateData.tags = { set: tags as string[] };
            } else if (typeof tags === 'string') {
                updateData.tags = { set: (tags as string).split(',').map((t: string) => t.trim()) };
            }
        }
        if (files && files.length > 0) {
            updateData.images = { push: files.map(f => f.path) };
        }

        const product = await prisma.product.update({
            where: { id: req.params.id as string },
            data: updateData
        });
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Admin: Delete product
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id as string } });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
