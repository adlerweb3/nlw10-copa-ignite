import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"], //shows all queries in console
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true, //console observability helper
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

  await fastify.listen({ port: 3333 });
}

bootstrap();
