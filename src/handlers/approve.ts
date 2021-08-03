import { Composer } from "grammy";

const composer = new Composer();

export default composer;

composer.callbackQuery("decline", async (ctx) => {
  const text = ctx.callbackQuery.message?.text;
  const from = text?.split("\n")[0].split("_")[1];
  const bot = text?.split("\n")[3].split(": ")[1];

  if (!text || !from || !bot) {
    return;
  }

  await ctx.editMessageText(
    `<strike>${text}</strike>` +
      `\n\n<b>❌ Declined by ${ctx.from.first_name}.</b>`
  );
  await ctx.answerCallbackQuery({ text: "Declined" });

  try {
    await ctx.api.sendMessage(from, `ℹ️ ${bot} was declined.`);
  } catch (err) {}
});

composer.callbackQuery("approve", async (ctx) => {
  const text = ctx.callbackQuery.message?.text;
  const from = text?.split("\n")[0].split("_")[1];
  const bot = text?.split("\n")[3].split(": ")[1];

  if (!text || !from || !bot) {
    return;
  }

  await ctx.editMessageText(
    `${text}` + `\n\n<b>✅ Approved by ${ctx.from.first_name}.</b>`
  );
  await ctx.answerCallbackQuery({ text: "Approved" });

  try {
    await ctx.api.sendMessage(
      from,
      `ℹ️ ${bot} was approved. Our team will talk to you soon.`
    );
  } catch (err) {}
});
