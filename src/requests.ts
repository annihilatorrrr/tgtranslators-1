import { Context } from "grammy";
import escapeHtml from "escape-html";
import { request } from "./database";
import { adminsChatId } from "./constants";

export const submitRequest = async (
  ctx: Context,
  bot: string,
  languages: Array<string>
): Promise<boolean> => {
  await request(bot);
  await ctx.api.sendMessage(
    adminsChatId,
    `🆕 <b>Translation Request #u_${ctx.from?.id}</b>\n\n` +
      `👤 <b>From:</b> <a href="tg://user?id=${ctx.from?.id}">` +
      escapeHtml(ctx.from?.first_name) +
      `</a>\n🤖 Bot: ${bot}\n` +
      `🔡 <b>Languages:</b> ${languages.join(", ")}`,
    {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "❌ Decline", callback_data: "decline" },
            { text: "Approve ✅", callback_data: "approve" },
          ],
        ],
      },
    }
  );
  return true;
};
