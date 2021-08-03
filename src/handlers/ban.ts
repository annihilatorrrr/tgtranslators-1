import { Composer } from "grammy";
import { ban, unban } from "../database";

const composer = new Composer();

export default composer;

composer.command("ban", async (ctx) => {
  const user = Number(ctx.message?.text.split(/\s/)[1]);

  if (user) {
    await ban(user);
    await ctx.reply("✅ Banned!");

    try {
      await ctx.api.sendMessage(user, "🚫 You have been banned.");
    } catch (err) {}
  }
});

composer.command("unban", async (ctx) => {
  const user = Number(ctx.message?.text.split(/\s/)[1]);

  if (user) {
    await unban(user);
    await ctx.reply("✅ Unbanned!");

    try {
      await ctx.api.sendMessage(user, "🎉 You have been unbanned.");
    } catch (err) {}
  }
});
