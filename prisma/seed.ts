// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 👇 demo user
  const hashedPassword = await bcrypt.hash('Ra52w102$', 10);

  await prisma.user.upsert({
    where: { email: 'andr0476@outlook.com' },   // email is @unique
    update: {},                                 // nothing to change if it exists
    create: {
      email: 'andr0476@outlook.com',
      hashedPassword,
    },
  });
}

main()
  .then(() => console.log('✅  Seed completed'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
