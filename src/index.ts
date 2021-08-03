import bot from "./bot";
import database from "./database";

Promise.all([bot, database]);
