import { Bot } from "grammy";
import env from "./env";
import handlers from "./handlers";

const bot = new Bot(env.BOT_TOKEN);

bot.api.config.use((prev, method, payload) =>
  prev(method, {
    disable_web_page_preview: true,
    parse_mode: "HTML",
    ...payload,
  })
);

bot.use(handlers);

export default () => bot.start({ drop_pending_updates: true });
