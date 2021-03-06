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
    `<b>š Translation Request #u_${ctx.from?.id}</b>\n\n` +
      `<b>š¤ From:</b> <a href="tg://user?id=${ctx.from?.id}">` +
      escapeHtml(ctx.from?.first_name) +
      `</a>\nš¤ Bot: ${bot}\n` +
      `<b>š· Languages:</b> ${languages.join(", ")}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "ā Decline", callback_data: "decline" },
            { text: "Approve ā", callback_data: "approve" },
          ],
        ],
      },
    }
  );
  await ctx.api.pinChatMessage(message.chat.id, message.message_id);
};
