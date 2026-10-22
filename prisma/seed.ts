import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const email = 'admin@truth.app';
const password = 'password123';

async function main() {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Seed user already exists');
    return;
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

  await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  console.log('Seeded Truth admin user');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
