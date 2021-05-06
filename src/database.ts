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

export const isRequested = async (project: string): Promise<boolean> => {
  if (await requests.findOne({ project: project })) return true;
  return false;
};

export const request = async (project: string): Promise<void> => {
  if (await isRequested(project))
    throw new Error("This project is already requested.");
  await requests.insertOne({ project: project });
};

export const isBanned = async (user_id: number): Promise<boolean> => {
  if (await bans.findOne({ user_id: user_id })) return true;
  return false;
};

export const ban = async (user_id: number): Promise<void> => {
  if (await isBanned(user_id)) throw new Error("This user is already banned.");
  await bans.insertOne({ user_id: user_id });
};

export const unban = async (user_id: number): Promise<void> => {
  if (!(await isBanned(user_id))) throw new Error("This user is not banned.");
  await bans.deleteOne({ user_id: user_id });
};
