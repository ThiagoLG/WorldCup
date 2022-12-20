import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function userRoutes(fastify: FastifyInstance) {
  /*- Endpoint para obter o contador de usuários -*/
  fastify.get('/users/count', async () => {

    const count = await prisma.user.count()

    return { count }
  });

}