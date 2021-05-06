import { Composer } from "grammy";
import { submitRequest } from "../requests";
import { getLangauges, languageAvailable } from "../languages";
import { adminsChatId } from "../constants";

const composer = new Composer();

composer.command("start", async (ctx) => {
  await ctx.reply(
    `👋 <i>Hello!</i>

<b>You can use me submit your Telegram bot to the</b> <i><a href='https://t.me/TGTranslators'>TG Translators</a></i> team in order to make your it multilingual.

👨‍💻 Use /new the button below to <b>make a new translation request</b>.`,
    {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "📚 New request", callback_data: "new" }]],
      },
    }
  );
});

composer.command("new", async (ctx) => {
  await ctx.reply("Send your bot username.", {
    reply_markup: { force_reply: true },
  });
});

composer.callbackQuery("new", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Send your bot username.", {
    reply_markup: { force_reply: true },
  });
});

composer.filter(
  (ctx) => {
    const message = ctx.message?.reply_to_message;
    const text = message?.text;

    if (text && message?.from?.id == ctx.me.id) {
      if (
        text.endsWith("Send your bot username.") ||
        text.endsWith("This is not a valid username, make sure you include @.")
      )
        return true;
    }

    return false;
  },
  async (ctx) => {
    const text = ctx.message?.text;
    const entities = ctx.message?.entities;

    if (
      entities?.length === 1 &&
      entities[0].type === "mention" &&
      entities[0].offset === 0 &&
      text
    ) {
      const url = `t.me/${text.slice(1, entities[0].length).toLowerCase()}`;
      await ctx.reply(
        `<a href="${url}">\xad</a>` +
          "Send me the code of the languages " +
          "that you like your bot to be available in. " +
          "For a list of available languages see /languages.",
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: { force_reply: true },
        }
      );
    } else {
      await ctx.reply(
        "This is not a valid username, make sure you include @.",
        {
          reply_markup: { force_reply: true },
        }
      );
    }
  }
);

composer.command("languages", async (ctx) => await ctx.reply(getLangauges()));

composer.filter(
  (ctx) =>
    (ctx.message?.reply_to_message?.text?.endsWith(
      "For a list of available languages see /languages."
    ) &&
      ctx.message?.reply_to_message?.from?.id == ctx.me.id) ||
    false,
  async (ctx) => {
    const text = ctx.message?.text;
    const entities = ctx.message?.reply_to_message?.entities;

    if (entities && entities[0] && entities[0].type == "text_link" && text) {
      const url = entities[0].url;
      const languages = text.split(/\s/);

      for (let language in languages) {
        language = languages[language];

        if (!languageAvailable(language)) {
          await ctx.reply(
            `<a href="${url}">\xad</a>` +
              `The language ${language} is not available now. ` +
              "For a list of available languages see /languages.",
            {
              parse_mode: "HTML",
              disable_web_page_preview: true,
              reply_markup: { force_reply: true },
            }
          );
          return;
        }
      }

      try {
        await submitRequest(ctx, url, languages);
        await ctx.reply("✅ Your request was submitted successfully.");
      } catch (error) {
        await ctx.reply(error.message);
      }
    }
  }
);
composer.filter(
  (ctx) =>
    (ctx.message?.reply_to_message?.text?.endsWith(
      "Reply this message to send them a message."
    ) &&
      ctx.message?.reply_to_message?.from?.id == ctx.me.id) ||
    false,
  async (ctx) => {
    const message = await ctx.forwardMessage(adminsChatId);
    await ctx.api.sendMessage(adminsChatId, `#u_${ctx.from?.id}`, {
      reply_to_message_id: message.message_id,
    });
  }
);

export default composer;
