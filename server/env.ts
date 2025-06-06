import { config } from "dotenv";
config({ path: [".env.local", ".env"] });
if (!process.env.DATABASE_URL) {
  console.error("[startup] \u274C DATABASE_URL is missing. Check .env.local");
  process.exit(1);
}
