import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      avatarUrl: 'https://github.com/adlerweb3.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      // chained inserts | Participants
      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  /* replaced by chained insert inside pool */
  /* const participant = await prisma.participant.create({
    data: {
      poolId: pool.id,
      userId: user.id,
    }
  }) */

  await prisma.game.create({
    data: {
      date: '2022-11-10T12:00:00.000Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-11T12:00:00.000Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      // chained inserts | guesses
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participants: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    },
  })
}

main()