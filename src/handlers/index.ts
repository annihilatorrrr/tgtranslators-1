import { Composer } from "grammy";
import env from "../env";
import ban from "./ban";
import approve from "./approve";
import conversation from "./conversation";
import new_ from "./new";
import start from "./start";

const composer = new Composer();

export default composer;

composer.use(conversation);

composer
  .filter((ctx) => ctx.chat?.id == env.ADMINS_CHAT_ID)
  .use(ban)
  .use(approve);

composer
  .filter((ctx) => ctx.chat?.type == "private")
  .use(new_)
  .use(start);
