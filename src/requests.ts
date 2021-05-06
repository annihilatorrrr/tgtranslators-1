import { Context } from "grammy";
import escapeHtml from "escape-html";
import { request } from "./database";
import { adminsChatId } from "./constants";

export const submitRequest = async (
  ctx: Context,
  project: string,
  languages: Array<string>
): Promise<boolean> => {
  await request(project);
  await ctx.api.sendMessage(
    adminsChatId,
    `New Request #u_${ctx.from?.id}\n\n` +
      `From: <a href="tg://user?id=${ctx.from?.id}">` +
      escapeHtml(ctx.from?.first_name) +
      `</a>\nProject: ${project}\n` +
      `Languages: ${languages.join(", ")}`,
    {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Decline", callback_data: "decline" },
            { text: "Approve", callback_data: "approve" },
          ],
        ],
      },
    }
  );
  return true;
};
