import bot from "./bot";
import database from "./database";

(async () => {
  await database();
  await bot();
})();
