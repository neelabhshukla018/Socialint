import "dotenv/config";

import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const client = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});

// Connect once when the backend starts.
const runtime = await client.connect();

export const db = client;
export { runtime };