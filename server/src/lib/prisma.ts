import { PrismaClient } from "@prisma/client";

/*- Inicia o prisma -*/
export const prisma = new PrismaClient({
  log: ['query']
})
