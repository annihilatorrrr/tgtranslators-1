import { config } from "dotenv";
import { cleanEnv, str, num } from "envalid";

config();

export default cleanEnv(process.env, {
  BOT_TOKEN: str(),
  ADMINS_CHAT_ID: num(),
  DB_URI: str({ default: "mongodb://127.0.0.1:27017/" }),
  DB_NAME: str({ default: "tgtranslators" }),
});
