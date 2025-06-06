import { prisma } from './client'

export function createUser(email: string, hashedPassword?: string) {
  return prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  })
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

