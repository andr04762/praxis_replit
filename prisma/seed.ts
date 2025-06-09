import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('seed', 10);

  await prisma.user.upsert({
    where: { email: 'andr0476@outlook.com' },
    update: {},
    create: { email: 'andr0476@outlook.com', hashedPassword },
  });
}

main()
  .then(() => console.log('✅  Seed completed'))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
