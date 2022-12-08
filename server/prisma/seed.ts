import { PrismaClient } from '@prisma/client'

/*- Instância do prisma -*/
const prisma = new PrismaClient();

/**
 * Função principal para controlar criação de dados
 */
async function main() {

  /*- Criação de novos usuários -*/
  const user = await prisma.user.create({
    data: {
      nome: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/ThiagoLG.png'
    }
  })

  /*- Criação de nova pool -*/
  const pool = await prisma.pool.create({
    data: {
      title: 'Example pool',
      code: 'BOL123',
      ownerId: user.id,

      //Cria o registro de participant através desta pool com o user id informado
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  });

  const firstGame = await prisma.game.create({
    data: {
      date: '2022-12-16T01:55:51.180Z',
      firstTeamCoutryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  const secondGame = await prisma.game.create({
    data: {
      date: '2022-12-18T01:55:51.180Z',
      firstTeamCoutryCode: 'BR',
      secondTeamCountryCode: 'AR',

      //cria um registro de bolão já associado ao jogo criado
      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 0,

          //Conecta o paticipante já existente ao palpite
          participant: {
            connect: {
              //Conceta através da chave primária composta (usuário + aposta)
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }

          }

        }
      }
    }
  })
}

main();