import mongodb from "mongodb";
import { dbUri } from "./constants";

const client = new mongodb.MongoClient(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var requests: mongodb.Collection;
var bans: mongodb.Collection;

(async () => {
  await client.connect();
  requests = client.db("tgtranslators").collection("requests");
  bans = client.db("tgtranslators").collection("bans");
})();

export const isRequested = async (bot: string): Promise<boolean> => {
  if (await requests.findOne({ bot: bot })) return true;
  return false;
};

export const request = async (bot: string): Promise<void> => {
  if (await isRequested(bot))
    throw new Error("❌ This bot is already requested.");
  await requests.insertOne({ bot: bot });
};

export const isBanned = async (user_id: number): Promise<boolean> => {
  if (await bans.findOne({ user_id: user_id })) return true;
  return false;
};

export const ban = async (user_id: number): Promise<void> => {
  if (await isBanned(user_id))
    throw new Error("❌ This user is already banned.");
  await bans.insertOne({ user_id: user_id });
};

export const unban = async (user_id: number): Promise<void> => {
  if (!(await isBanned(user_id)))
    throw new Error("❌ This user is not banned.");
  await bans.deleteOne({ user_id: user_id });
};
