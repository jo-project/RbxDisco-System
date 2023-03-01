import { Bot } from "./structures/bot.js";
import { log } from "./extensions/logger.js";
import { config } from "dotenv";
config();

console.clear();
process.stdout.write('\u001B]0;Discord Bot\u0007');
const bot = new Bot(process.env.TOKEN!)
.addGuildId(`1055340720430526464`)
.start()