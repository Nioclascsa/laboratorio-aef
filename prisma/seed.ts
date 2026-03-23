import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import 'dotenv/config'

async function main() {
  const email = 'admin@laboratorio.cl'
  const password = await bcrypt.hash('ciencia2026', 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      name: 'Investigador Principal',
      role: Role.ADMIN,
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })