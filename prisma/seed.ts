import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('pass', 10);

  await prisma.user.upsert({
    where: { email: 'andr0476@outlook.com' },
    update: { hashedPassword },
    create: { email: 'andr0476@outlook.com', hashedPassword },
  });

  console.log(`✅ Seeded user: andr0476@outlook.com`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// prisma/seed.ts
async function main() {
  const hashedPassword = await bcrypt.hash('Ra52w102$', 10);

  await prisma.user.upsert({
    where: { email: 'andr0476@outlook.com' },   // ← use UNIQUE email, not id
    update: {},                                 // keep empty or set fields to change
    create: {
      email: 'andr0476@outlook.com',
      hashedPassword,
    },
  });
}
