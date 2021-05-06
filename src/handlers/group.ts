import { Composer } from "grammy";
import { ban, unban } from "../database";

const composer = new Composer();

composer.callbackQuery("decline", async (ctx) => {
  const text = ctx.callbackQuery.message?.text;
  const entitites = ctx.callbackQuery.message?.entities;
  const from = text?.split("\n")[0].split("_")[1];
  const bot = text?.split("\n")[3].split(": ")[1];
  await ctx.editMessageText(
    text + `\n\n❌ Declined by ${ctx.from.first_name}.`,
    {
      disable_web_page_preview: true,
      entities: entitites,
    }
  );
  await ctx.answerCallbackQuery({ text: "Declined" });

  if (from) {
    await ctx.api.sendMessage(from, `ℹ️ ${bot} was declined.`, {
      disable_web_page_preview: true,
    });
  }
});

composer.callbackQuery("approve", async (ctx) => {
  const text = ctx.callbackQuery.message?.text;
  const entitites = ctx.callbackQuery.message?.entities;
  const from = text?.split("\n")[0].split("_")[1];
  const bot = text?.split("\n")[3].split(": ")[1];
  await ctx.editMessageText(
    text + `\n\n✅ Approved by ${ctx.from.first_name}.`,
    {
      disable_web_page_preview: true,
      entities: entitites,
    }
  );
  await ctx.answerCallbackQuery({ text: "Approved" });

  if (from) {
    await ctx.api.sendMessage(
      from,
      `ℹ️ ${bot} was approved. Our team will talk to you soon.`,
      {
        disable_web_page_preview: true,
      }
    );
  }
});

composer.command("ban", async (ctx) => {
  const user = ctx.message?.text.split(/\s/)[1];

  if (user && parseInt(user)) {
    await ban(parseInt(user));
    await ctx.reply("✅ Banned!");
    await ctx.api.sendMessage(user, "🚫 You have been banned.");
  }
});

composer.command("unban", async (ctx) => {
  const user = ctx.message?.text.split(/\s/)[1];

  if (user && parseInt(user)) {
    await unban(parseInt(user));
    await ctx.reply("✅ Unbanned!");
    await ctx.api.sendMessage(user, "🎉 You have been unbanned.");
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
        "ℹ️ This is a message from our team. Reply this message to send them a message.",
        {
          reply_to_message_id: message.message_id,
          reply_markup: { force_reply: true },
        }
      );
    }
  }
);

export default composer;
