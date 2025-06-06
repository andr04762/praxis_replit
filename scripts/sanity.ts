import { PrismaClient } from '@prisma/client';
(async () => {
  const prisma = new PrismaClient();
  console.log('[SANITY] DATABASE_URL =', process.env.DATABASE_URL);
  console.log('[SANITY] Users in DB:', await prisma.user.findMany());
  await prisma.$disconnect();
})();
