import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { ElizaService } from "../gen/eliza_pb.ts";

const transport = createGrpcTransport({
    baseUrl: `http://${process.env.SERVER_HOST ?? "localhost:4242"}`,
})

const client = createClient(ElizaService, transport)

while (true) {
    try {
        const response = await client.say({
            sentence: `My magic number is ${Math.random()}`
        });
        console.log(`Response from server: ${response.sentence}`);
    } catch (error) {
        console.warn(`Error from server: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.INTERVAL_MS ?? "1000")));
}