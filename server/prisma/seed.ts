import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/marketplace?schema=public';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Admin account...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Seeding Dummy Customer account...');
  const dummyUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      role: 'USER',
    }
  });

  console.log('Seeding Products...');
  const products = [
    {
      name: 'Minimalist Desk Lamp',
      description: 'A sleek, modern desk lamp with adjustable brightness, perfect for your workspace.',
      type: 'PHYSICAL' as const,
      price: 49.99,
      currency: 'USD',
      stock: 15,
      tags: ['Home', 'Office', 'Lighting'],
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600'],
    },
    {
      name: 'React UI Kit - Digital Template',
      description: 'A comprehensive React UI kit with 100+ components to kickstart your next project.',
      type: 'DIGITAL' as const,
      price: 29.00,
      currency: 'USD',
      stock: null,
      tags: ['Digital', 'Web Design', 'Code'],
      images: ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600'],
    },
    {
      name: 'Ergonomic Keyboard',
      description: 'Split ergonomic keyboard designed to reduce strain during long coding sessions.',
      type: 'PHYSICAL' as const,
      price: 129.50,
      currency: 'USD',
      stock: 5,
      tags: ['Electronics', 'Accessories', 'Office'],
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600'],
    },
    {
      name: 'Freelancer Invoice Template',
      description: 'Professional, customizable invoice template for freelancers and consultants.',
      type: 'DIGITAL' as const,
      price: 9.99,
      currency: 'USD',
      stock: null,
      tags: ['Digital', 'Business', 'Template'],
      images: ['https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=600'],
    }
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    });

    // Create a dummy review for each product
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: dummyUser.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: 'Great product, highly recommended!',
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
