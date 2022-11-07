import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

const prisma = new PrismaClient({
  log: ["query"], //shows all queries in console
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true, //console observability helper
  });

  /**
   * WARNING | Routes Security Settings
   */
  await fastify.register(cors, {
    // allow everything ONLY DEV MODE
    origin: true,

    // allow specific domain | DEPLOY
    // origin: "www.mydomain.com",
  });

  //pools count route: "http://localhost:3333/pools/count"
  fastify.get("/pools/count", async () => {
    const countAllPools = await prisma.pool.count();

    return { countAllPools };
  });

  //users count route: "http://localhost:3333/users/count"
  fastify.get("/users/count", async () => {
    const countAllUsers = await prisma.user.count();

    return { countAllUsers };
  });

  //Guesses count route: "http://localhost:3333/guesses/count"
  fastify.get("/guesses/count", async () => {
    const countAllGuesses = await prisma.guess.count();

    return { countAllGuesses };
  });




  //create pool route: "http://localhost:3333/pools with ZOD validation"
  fastify.post('/pools', async (request, reply) => {

    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)

    const generateNewCode = new ShortUniqueId({length: 6});
    const code = String(generateNewCode()).toUpperCase();
    await prisma.pool.create({
      data: {
        title,
        code,
      }
    });

    return reply.status(201).send({ code })
  });


  // Add to listen [host: '0.0.0.0'] for mobile tests
  await fastify.listen({ port: 3333 /* host: "0.0.0.0" */ });
}

bootstrap();
