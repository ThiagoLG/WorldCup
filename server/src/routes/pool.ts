import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {

  /*- Endpoint para obter o contador de pools-*/
  fastify.get('/pools/count', async () => {

    const count = await prisma.pool.count()

    return { count }
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

    let ownerId = null;

    try {
      await request.jwtVerify();

      // cria o bolão no nome do usuário logado e já registra sua participação
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })

    } catch (e) {

      /*- Realiza o insert no banco pelo prisma sem o usuário autenticado -*/
      const pool = await prisma.pool.create({
        data: {
          title,
          code: code
        }
      })

    }

    /*- Envia a requisição -*/
    return reply.status(201).send({ code });
  });

  /*- Endpoint para registrar o usuário no bolão -*/
  fastify.post('/pools/join', {
    onRequest: [authenticate]
  }, async (request, reply) => {

    // valida o corpo com o zod
    const joinPoolBody = z.object({
      code: z.string()
    });

    // obtém o código da request validado pelo zod
    const { code } = joinPoolBody.parse(request.body);

    //procura o bolão pelo código recebido e também se o usuário já faz parte ou não
    const pool = await prisma.pool.findUnique({
      where: {
        code
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub
          }
        }
      }
    });

    // se não tiver bolão registrado com o código recebido
    if (!pool) {
      return reply.status(400).send({
        message: 'Pool not found'
      })
    }
    // se o usuário já estiver inscrito no bolão selecionado
    if (pool.participants.length > 0) {
      return reply.status(400).send({
        message: 'yout already joined this pool.'
      })
    }

    // se o bolão que o usuário estiver tentando partificar não tiver dono, ele se torna o dono (primeiro inscrito = dono)
    if (!pool.ownerId) {
      await prisma.pool.update({
        where: {
          id: pool.id
        },
        data: {
          ownerId: request.user.sub
        }
      })
    }

    // se passar por todas as validações, registra o usuário no bolão
    await prisma.participant.create({
      data: {
        poolId: pool.id,
        userId: request.user.sub
      }
    })

    return reply.status(201).send();

  });

  /*- Endpoint para buscar os bolões que o usuário está registrado -*/
  fastify.get('/pools', {
    onRequest: [authenticate]
  }, async (request) => {
    // busca todos os bolões onde pelo menos um dos participantes é o usuário logado
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub
          }
        }
      },
      include: { // inclui informações extras na consulta
        _count: { // contagem de participantes
          select: {
            participants: true
          }
        },
        owner: {
          select: { //obtém informações específicas da amarração com owner
            nome: true,
            id: true
          }
        },
        participants: { //obtém informações dos participantes para exibir
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        }
      }
    });

    return { pools }
  });

  /*- Endpoint para buscar informações de um bolão específico -*/
  fastify.get("/pools/:id", {
    onRequest: [authenticate]
  }, async (request) => {

    const getPoolParams = z.object({
      id: z.string()
    })

    // obtém infromações validadas pelo zod, porém obtidas o request params (url da request) e não do body da request como nas demais
    const { id } = getPoolParams.parse(request.params)

    // obtém os bolões filtrando pelo id
    const pools = await prisma.pool.findMany({
      where: {
        id
      },
      include: { // inclui informações extras na consulta
        _count: { // contagem de participantes
          select: {
            participants: true
          }
        },
        owner: {
          select: { //obtém informações específicas da amarração com owner
            nome: true,
            id: true
          }
        },
        participants: { //obtém informações dos participantes para exibir
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
                nome: true
              }
            }
          }
        }
      }
    });

    return { pools }
  });

}