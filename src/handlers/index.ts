import { Bot } from "grammy";
import { isBanned } from "../database";
import { adminsChatId } from "../constants";
import _private from "./private";
import _group from "./group";

export const addHandlers = (bot: Bot) => {
  bot
    .filter(async (ctx) => {
      if (
        ctx.chat &&
        ctx.from &&
        ctx.chat.type == "private" &&
        !(await isBanned(ctx.from.id))
      )
        return true;
      return false;
    })
    .use(_private);
  bot.filter((ctx) => ctx.chat?.id == adminsChatId).use(_group);
};
