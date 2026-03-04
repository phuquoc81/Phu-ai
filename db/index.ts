import { PrismaClient } from "@prisma/client"

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient
}

export const db =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = db
}

export default db
