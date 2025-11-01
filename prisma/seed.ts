import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('ADMIN_EMAIL/ADMIN_PASSWORD not set. Skipping admin seed.');
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, name: 'Owner', passwordHash, role: Role.OWNER },
    update: { passwordHash, role: Role.OWNER },
  });
  console.log('Seeded OWNER admin:', email);

  // Seed categories
  const categories = [
    { name: 'Plush', slug: 'plush' },
    { name: 'Puzzles', slug: 'puzzles' },
    { name: 'Vehicles', slug: 'vehicles' },
    { name: 'STEM', slug: 'stem' },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        create: cat,
        update: cat,
      })
    )
  );
  console.log(`Seeded ${createdCategories.length} categories`);

  // Sample product data
  const products = [
    {
      title: 'Soft Teddy Bear',
      slug: 'soft-teddy-bear',
      description: 'A cuddly and soft teddy bear perfect for bedtime stories and hugs. Made with premium soft material.',
      categorySlug: 'plush',
      ageMin: 0,
      ageMax: 5,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'TEDDY-BRN-001', optionValues: { color: 'Brown', size: 'Medium' }, priceCents: 89900, stock: 25 },
        { sku: 'TEDDY-BRN-002', optionValues: { color: 'Brown', size: 'Large' }, priceCents: 129900, stock: 15 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1548438294-1ad5d5f1f063?w=800', alt: 'Brown teddy bear' },
        { url: 'https://images.unsplash.com/photo-1589873615937-d30a6cf5845c?w=800', alt: 'Teddy bear detail' },
      ],
    },
    {
      title: 'Wooden Jigsaw Puzzle',
      slug: 'wooden-jigsaw-puzzle',
      description: '100-piece wooden jigsaw puzzle featuring animals. Helps develop problem-solving skills.',
      categorySlug: 'puzzles',
      ageMin: 3,
      ageMax: 8,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'PUZZLE-001', optionValues: { pieces: '100' }, priceCents: 149900, stock: 30 },
        { sku: 'PUZZLE-002', optionValues: { pieces: '200' }, priceCents: 249900, stock: 20 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1611522135885-5d61c9e34e5e?w=800', alt: 'Wooden puzzle' },
      ],
    },
    {
      title: 'Remote Control Car',
      slug: 'remote-control-car',
      description: 'Fast and fun remote control car with LED lights. Perfect for outdoor play.',
      categorySlug: 'vehicles',
      ageMin: 5,
      ageMax: 12,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'RCCAR-RED-001', optionValues: { color: 'Red' }, priceCents: 199900, stock: 18 },
        { sku: 'RCCAR-BLU-001', optionValues: { color: 'Blue' }, priceCents: 199900, stock: 22 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800', alt: 'Remote control car' },
        { url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', alt: 'RC car detail' },
      ],
    },
    {
      title: 'Building Blocks Set',
      slug: 'building-blocks-set',
      description: '150-piece building blocks set in various colors. Encourages creativity and motor skills.',
      categorySlug: 'stem',
      ageMin: 2,
      ageMax: 10,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'BLOCKS-150', optionValues: { pieces: '150' }, priceCents: 179900, stock: 35 },
        { sku: 'BLOCKS-300', optionValues: { pieces: '300' }, priceCents: 299900, stock: 15 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Building blocks' },
        { url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800', alt: 'Blocks detail' },
      ],
    },
    {
      title: 'Stuffed Elephant',
      slug: 'stuffed-elephant',
      description: 'Large plush elephant with soft gray fabric. Great companion for children.',
      categorySlug: 'plush',
      ageMin: 0,
      ageMax: 6,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'ELEPH-001', optionValues: { size: 'Medium' }, priceCents: 129900, stock: 20 },
        { sku: 'ELEPH-002', optionValues: { size: 'Large' }, priceCents: 179900, stock: 12 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800', alt: 'Stuffed elephant' },
      ],
    },
    {
      title: '3D Wooden Puzzle',
      slug: '3d-wooden-puzzle',
      description: '3D wooden puzzle of famous monuments. Great for older kids and teens.',
      categorySlug: 'puzzles',
      ageMin: 8,
      ageMax: 14,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: '3DPUZZ-001', optionValues: { model: 'Eiffel Tower' }, priceCents: 349900, stock: 10 },
        { sku: '3DPUZZ-002', optionValues: { model: 'Taj Mahal' }, priceCents: 349900, stock: 8 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1603743309797-507990471a3b?w=800', alt: '3D wooden puzzle' },
      ],
    },
    {
      title: 'Train Set',
      slug: 'train-set',
      description: 'Complete wooden train set with tracks and locomotive. Perfect for imaginative play.',
      categorySlug: 'vehicles',
      ageMin: 3,
      ageMax: 10,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'TRAIN-BASIC', optionValues: { pieces: '20' }, priceCents: 449900, stock: 12 },
        { sku: 'TRAIN-PREM', optionValues: { pieces: '40' }, priceCents: 799900, stock: 6 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800', alt: 'Train set' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', alt: 'Train detail' },
      ],
    },
    {
      title: 'Science Experiment Kit',
      slug: 'science-experiment-kit',
      description: 'Complete science experiment kit with 30+ experiments. Includes safety goggles and materials.',
      categorySlug: 'stem',
      ageMin: 6,
      ageMax: 14,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'SCIKIT-BASIC', optionValues: { experiments: '30' }, priceCents: 199900, stock: 25 },
        { sku: 'SCIKIT-ADV', optionValues: { experiments: '50' }, priceCents: 349900, stock: 15 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800', alt: 'Science kit' },
      ],
    },
    {
      title: 'Plush Unicorn',
      slug: 'plush-unicorn',
      description: 'Magical unicorn plush toy with rainbow mane. Sparkly and soft.',
      categorySlug: 'plush',
      ageMin: 2,
      ageMax: 8,
      status: ProductStatus.DRAFT,
      variants: [
        { sku: 'UNI-PINK', optionValues: { color: 'Pink' }, priceCents: 159900, stock: 0 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1596050046896-db28e7fbf644?w=800', alt: 'Plush unicorn' },
      ],
    },
    {
      title: 'Magnetic Tiles',
      slug: 'magnetic-tiles',
      description: '100-piece magnetic building tiles. Create endless structures and shapes.',
      categorySlug: 'stem',
      ageMin: 3,
      ageMax: 12,
      status: ProductStatus.ACTIVE,
      variants: [
        { sku: 'MAGTILE-100', optionValues: { pieces: '100' }, priceCents: 279900, stock: 28 },
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800', alt: 'Magnetic tiles' },
        { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', alt: 'Tiles detail' },
      ],
    },
  ];

  // Seed products
  for (const productData of products) {
    const category = createdCategories.find((c) => c.slug === productData.categorySlug);
    if (!category) continue;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    let product;
    if (existingProduct) {
      // Update existing product
      product = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          title: productData.title,
          description: productData.description,
          categoryId: category.id,
          ageMin: productData.ageMin,
          ageMax: productData.ageMax,
          status: productData.status,
        },
      });
      // Delete old variants and images
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
      await prisma.image.deleteMany({ where: { productId: product.id } });
    } else {
      // Create new product
      product = await prisma.product.create({
        data: {
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          categoryId: category.id,
          ageMin: productData.ageMin,
          ageMax: productData.ageMax,
          status: productData.status,
        },
      });
    }

    // Create images
    const images = await Promise.all(
      productData.images.map((img) =>
        prisma.image.create({
          data: {
            url: img.url,
            alt: img.alt,
            productId: product.id,
          },
        })
      )
    );

    // Create variants
    await Promise.all(
      productData.variants.map((variant) =>
        prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: variant.sku,
            optionValues: variant.optionValues,
            priceCents: variant.priceCents,
            stock: variant.stock,
            imageIds: images.map((img) => img.id).slice(0, 2), // Assign first 2 images to variants
          },
        })
      )
    );

    console.log(`Seeded product: ${product.title}`);
  }

  console.log(`Seeded ${products.length} products`);
}

main().finally(async () => prisma.$disconnect());



