import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  /*- Endpoint para obter o contador de palpites -*/
  fastify.get('/guesses/count', async () => {

    const count = await prisma.guess.count()

    return { count }
  });

  /*- Endpoint para inserir um palpite no bolão -*/
  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate]
  }, async (request, reply) => {

    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string()
    });

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number()
    })

    const { poolId, gameId } = createGuessParams.parse(request.params);
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body);

    // verifica se o usuário faz parte do bolão
    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    })

    // se não estiver participando no bolão, retorna um erro
    if (!participant) {
      return reply.status(400).send({
        message: "You're not allowed to create a guess inside this pool."
      })
    }

    // verifica se o usuário já fez algum palpite neste jogo
    // ******************* SEGUIR A PARTIR DAQUI *******************

    return {
      poolId,
      gameId,
      firstTeamPoints,
      secondTeamPoints
    }

  })
}