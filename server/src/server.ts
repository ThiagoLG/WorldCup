import Fastify from "fastify";
import { PrismaClient } from "@prisma/client"
import cors from "@fastify/cors";

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

  /*- Inicia o serviço na porta 3333 -*/
  await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap();