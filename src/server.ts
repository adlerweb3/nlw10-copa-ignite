import Fastify from 'fastify';

async function bootstrap() {
    const fastify = Fastify({
        logger: true, //console observability helper
    })

    //First route | pools count: "http://localhost:3333/pools/count"
    fastify.get('/pools/count', () => {
        return { count: 8888 }
    })

    await fastify.listen({ port: 3333 })
}

bootstrap()