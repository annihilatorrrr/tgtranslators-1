import { Bot, Context } from "grammy";
import { addHandlers } from "./handlers";
import { botToken } from "./constants";

export const bot = new Bot(botToken);
addHandlers(bot);

bot.api.config.use((prev, method, payload) =>
  prev(method, {
    disable_web_page_preview: true,
    parse_mode: "HTML",
    ...payload,
  })
);

bot.catch((error) => console.log(error.error));
bot.start({ drop_pending_updates: true });
