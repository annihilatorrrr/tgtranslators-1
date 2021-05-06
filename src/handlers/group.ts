import { Composer } from "grammy";
import { ban, unban } from "../database";

const composer = new Composer();

composer.callbackQuery("decline", async (ctx) => {
  const text = ctx.callbackQuery.message?.text;
  const entitites = ctx.callbackQuery.message?.entities;
  const from = text?.split("\n")[0].split("_")[1];
  const project = text?.split("\n")[3].split(": ")[1];

  if (from) {
    await ctx.api.sendMessage(from, `The project ${project} was declined.`);
  }

  await ctx.editMessageText(text + `\n\nDeclined by ${ctx.from.first_name}.`, {
    entities: entitites,
  });
  await ctx.answerCallbackQuery({ text: "Declined" });
});

composer.callbackQuery("approve", async (ctx) => {
  const text = ctx.callbackQuery.message?.text;
  const entitites = ctx.callbackQuery.message?.entities;
  const from = text?.split("\n")[0].split("_")[1];
  const project = text?.split("\n")[3].split(": ")[1];

  if (from) {
    await ctx.api.sendMessage(
      from,
      `The project ${project} was approved. Our team may send you a message.`
    );
  }

  await ctx.editMessageText(text + `\n\nApproved by ${ctx.from.first_name}.`, {
    entities: entitites,
  });
  await ctx.answerCallbackQuery({ text: "Approved" });
});

composer.command("ban", async (ctx) => {
  const user = ctx.message?.text.split(/\s/)[1];

  if (user && parseInt(user)) {
    await ban(parseInt(user));
    await ctx.reply("Banned!");
    await ctx.api.sendMessage(user, "You have been banned.");
  }
});

composer.command("unban", async (ctx) => {
  const user = ctx.message?.text.split(/\s/)[1];

  if (user && parseInt(user)) {
    await unban(parseInt(user));
    await ctx.reply("Unbanned!");
    await ctx.api.sendMessage(user, "You have been unbanned.");
  }
});

composer.filter(
  async (ctx) => {
    const from = ctx.message?.reply_to_message?.text
      ?.split("\n")[0]
      .split("_")[1];
    if (from) return true;
    return false;
  },
  async (ctx) => {
    const from = ctx.message?.reply_to_message?.text
      ?.split("\n")[0]
      .split("_")[1];
    if (from) {
      const message = await ctx.copyMessage(from);
      await ctx.api.sendMessage(
        from,
        "This is a message from our team. Reply this message to send them a message.",
        {
          reply_to_message_id: message.message_id,
          reply_markup: { force_reply: true },
        }
      );
    }
  }
);

export default composer;
