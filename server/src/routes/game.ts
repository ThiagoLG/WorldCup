import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
  /*- Obtém os jogos associados a um bolão específico -*/
  fastify.get('/pools/:id/games', {
    onRequest: [authenticate]
  }, async (request) => {

    const getPoolParams = z.object({
      id: z.string()
    });

    const { id } = getPoolParams.parse(request.params);

    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        guesses: {
          where: {
            participant: {
              userId: request.user.sub,
              poolId: id
            }
          }
        }
      }
    });

    return { games: games.map(g => {
      return {
        ...g,
        guess: g.guesses.length ? g.guesses[0] : null,
        guesses: undefined
      }
    }) }

  });
}