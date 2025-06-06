import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';               // bcryptjs if you switched

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Ra52w102$', 10);

  await prisma.user.upsert({
    where: { email: 'andr0476@outlook.com' },   // ← use the UNIQUE email
    update: {},                                 // nothing to update for now
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
