import Fastify from "fastify";
import { PrismaClient } from "@prisma/client"
import cors from "@fastify/cors";
import z from 'zod'
import ShortUniqueId from 'short-unique-id'

/*- Inicia o prisma -*/
const prisma = new PrismaClient({
  log: ['query']
})

/*- Função principal de inicialização do serviço -*/
async function bootstrap() {

  /*- Inicia o fastify -*/
  const fastify = Fastify({
    logger: true
  });

  /*- Realiza configuração de cors -*/
  await fastify.register(cors,
    {
      origin: true
    })

  /*- Endpoint para obter o contador de pools-*/
  fastify.get('/pools/count', async () => {

    const count = await prisma.pool.count()

    return { pools: count }
  });

  /*- Endpoint para obter o contador de palpites -*/
  fastify.get('/guesses/count', async () => {

    const count = await prisma.guess.count()

    return { guesses: count }
  });

  /*- Endpoint para obter o contador de usuários -*/
  fastify.get('/users/count', async () => {

    const count = await prisma.user.count()

    return { users: count }
  });

  /*- Endpoint para fazer o post de bolões-*/
  fastify.post('/pools', async (request, reply) => {

    /*- Valida o body da requisição -*/
    const createPoolBody = z.object({
      title: z.string()
    })

    /*- Faz o parse do corpo usando a validação do zod criada acima -*/
    const { title } = createPoolBody.parse(request.body);

    /*- Gera o Id para registrar no item -*/
    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    /*- Realiza o insert no banco pelo prisma -*/
    const pool = await prisma.pool.create({
      data: {
        title,
        code: code
      }
    })

    /*- Envia a requisição -*/
    return reply.status(201).send({ code });
  })

  /*- Inicia o serviço na porta 3333 -*/
  await fastify.listen({ port: 3333/*, host: '0.0.0.0'*/ });
}

bootstrap();