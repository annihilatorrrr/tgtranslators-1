import mongodb from "mongodb";
import env from "./env";

const client = new mongodb.MongoClient(env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getDb = () => client.db(env.DB_NAME);
const getCo = (name: string) => getDb().collection(name);

export const isRequested = async (bot: string): Promise<boolean> => {
  if (await getCo("requests").findOne({ bot: bot })) return true;
  return false;
};

export const request = async (bot: string): Promise<void> => {
  if (await isRequested(bot))
    throw new Error("❌ This bot is already requested.");
  await getCo("requests").insertOne({ bot: bot });
};

export const isBanned = async (user_id: number): Promise<boolean> => {
  if (await getCo("bans").findOne({ user_id: user_id })) return true;
  return false;
};

export const ban = async (user_id: number): Promise<void> => {
  if (await isBanned(user_id))
    throw new Error("❌ This user is already banned.");
  await getCo("bans").insertOne({ user_id: user_id });
};

export const unban = async (user_id: number): Promise<void> => {
  if (!(await isBanned(user_id)))
    throw new Error("❌ This user is not banned.");
  await getCo("bans").deleteOne({ user_id: user_id });
};

export default () => client.connect();
