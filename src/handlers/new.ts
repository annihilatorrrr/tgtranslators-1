import { Composer } from "grammy";
import { submitRequest } from "../requests";
import { getLangauges, languageIsAvailable } from "../languages";

const composer = new Composer();

export default composer;

composer.command("new", async (ctx) => {
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

composer.command("languages", (ctx) => ctx.reply(getLangauges()));

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

        if (!languageIsAvailable(language)) {
          await ctx.reply(
            `<a href="${url}">\xad</a>` +
              `The language ${language} is not available now. ` +
              "For a list of available languages see /languages.",
            {
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
