import { Context } from "grammy";
import escapeHtml from "escape-html";
import { request } from "./database";
import env from "./env";

export const submitRequest = async (
  ctx: Context,
  bot: string,
  languages: Array<string>
) => {
  await request(bot);
  const message = await ctx.api.sendMessage(
    env.ADMINS_CHAT_ID,
    `<b>🆕 Translation Request #u_${ctx.from?.id}</b>\n\n` +
      `<b>👤 From:</b> <a href="tg://user?id=${ctx.from?.id}">` +
      escapeHtml(ctx.from?.first_name) +
      `</a>\n🤖 Bot: ${bot}\n` +
      `<b>🏷 Languages:</b> ${languages.join(", ")}`,
    {
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
  await ctx.api.pinChatMessage(message.chat.id, message.message_id);
};
