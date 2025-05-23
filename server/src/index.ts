import { create } from "@bufbuild/protobuf";
import type { ConnectRouter } from "@connectrpc/connect";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { fastify } from "fastify";
import { ElizaService, SayResponseSchema } from "../gen/eliza_pb.ts";

const routes = (router: ConnectRouter) =>
    // registers connectrpc.eliza.v1.ElizaService
    router.service(ElizaService, {
        // implements rpc Say
        async say(req) {
            return create(SayResponseSchema, {
                sentence: `You said: ${req.sentence}`
            })
        },
    });

const server = fastify({
    http2: true,
});

await server.register(fastifyConnectPlugin, {
    routes,
    interceptors: [
        (next) => async (req) => {
            console.log("request", req.message);
            const response = await next(req);
            console.log("response", response.trailer, response.message);
            return response;
        }
    ]
});

process.on("SIGTERM", () => {
    server.close();
});

await server.listen({ host: "0.0.0.0", port: 4242 });

console.log("server is listening at", server.addresses());
