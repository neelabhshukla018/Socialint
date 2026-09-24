import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./contract.json" with { type: "json" };
const client = postgres({
    contractJson,
    url: process.env["DATABASE_URL"],
});
// Connect once when the backend starts.
const runtime = await client.connect();
export const db = client;
export { runtime };
