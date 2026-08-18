import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const passwordHash = process.env.ADMIN_PASSWORD_HASH

  if (!email || !passwordHash) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH not found in .env")
    return
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email }
  })

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      }
    })
    console.log("Admin user seeded successfully!")
  } else {
    console.log("Admin user already exists.")
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
