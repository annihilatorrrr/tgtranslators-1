import { Composer } from "grammy";
import { Message } from "@grammyjs/types";
import env from "../env";

const composer = new Composer();

export default composer;

const getFrom = (message: Message | undefined) =>
  Number(message?.text?.split("\n")[0].split("_")[1]);

composer.filter(
  async (ctx) => {
    const isFromRightGroup = ctx.chat?.id == env.ADMINS_CHAT_ID;
    const isFromBot = ctx.message?.reply_to_message?.from?.id == ctx.me.id;
    const hasFrom = getFrom(ctx.message?.reply_to_message);
    const notSuppressed = !(
      ctx.message?.text?.startsWith("!") ||
      ctx.message?.caption?.startsWith("!")
    );

    return Boolean(isFromRightGroup && isFromBot && hasFrom && notSuppressed);
  },
  async (ctx) => {
    const from = getFrom(ctx.message?.reply_to_message);

    if (!from) {
      return;
    }

    let message;

    try {
      message = await ctx.copyMessage(from);
    } catch (err) {
      await ctx.reply(`Could not send the message: ${ctx}`);
      return;
    }

    await ctx.api.sendMessage(
      from,
      "ℹ️ This is a message from our team. Reply this message to send them a message.",
      {
        reply_to_message_id: message.message_id,
        reply_markup: { force_reply: true },
      }
    );
  }
);

composer.filter(
  (ctx) =>
    Boolean(
      ctx.message?.reply_to_message?.text?.endsWith(
        "Reply this message to send them a message."
      ) && ctx.message?.reply_to_message?.from?.id == ctx.me.id
    ),
  async (ctx) => {
    const message = await ctx.forwardMessage(env.ADMINS_CHAT_ID);
    await ctx.api.sendMessage(env.ADMINS_CHAT_ID, `#u_${ctx.from?.id}`, {
      reply_to_message_id: message.message_id,
    });
  }
);
