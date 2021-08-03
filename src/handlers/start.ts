import { Composer, InlineKeyboard } from "grammy";

const composer = new Composer();

export default composer;

composer.command("start", async (ctx) => {
  await ctx.reply(
    `👋 <i>Hello!</i>
  
<b>You can use me submit your Telegram bot to the</b> <i><a href='https://t.me/TGTranslators'>TG Translators</a></i> team in order to make your it multilingual.
  
👨‍💻 Use /new or the button below to <b>make a new translation request</b>.`,
    {
      reply_markup: new InlineKeyboard()
        .text("📚 New request", "new")
        .row()
        .url("⚒ My source code", "https://github.com/rojserbest/tgtranslators"),
    }
  );
});
