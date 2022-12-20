import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt"
import { poolRoutes } from "./routes/pool";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";

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

  //Em produção isso precisa ser uma variável ambiente
  await fastify.register(jwt, {
    secret: 'nlwcopa'
  })

  /*- Realiza o registro das rotas -*/
  await fastify.register(poolRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(userRoutes);

  /*- Inicia o serviço na porta 3333 -*/
  await fastify.listen({ port: 3333/*, host: '0.0.0.0'*/ });
}

bootstrap();