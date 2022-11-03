import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";

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

  //   //First route | pools count: "http://localhost:3333/pools/count"
  //   fastify.get("/pools/count", async () => {
  //     const pools = await prisma.pool.findMany({
  //       where: {
  //         code: {
  //           startsWith: "z",
  //         },
  //       },
  //     });

  //     return { pools };
  //   });

  // Add to listen [host: '0.0.0.0'] for mobile tests
  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
