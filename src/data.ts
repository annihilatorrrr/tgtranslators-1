import { readFileSync } from "fs";
import { join, dirname } from "path";

export default JSON.parse(
  readFileSync(join(dirname(__dirname), "data.json")).toString()
);
