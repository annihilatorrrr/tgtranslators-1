import { join, dirname } from "path";
import { readFileSync } from "fs";
import { config } from "dotenv";

config();

interface Data {
  [key: string]: any;
}

export const rootDir = dirname(__dirname);
export const data: Data = JSON.parse(
  readFileSync(join(rootDir, "data.json")).toString()
);

export const botToken = process.env.BOT_TOKEN || "";
export const adminsChatId = process.env.ADMINS_CHAT_ID || 0;
export const dbUri = process.env.DB_URI || "mongodb://127.0.0.1:27017";
