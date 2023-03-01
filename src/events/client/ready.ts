import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import ora, { Ora} from 'ora';
import chalk from "chalk";

const ready = new EventBuilder(true)
.setName('ready')
.setCallback(
    async(client: Bot) => {
        await client.registerCommands();

        const spinner = ora({
            text: `[${chalk.hex('#7289DA')('Discord')}] Logging in...`,
            interval: 200
        }).start()

        let counter = 0;
        var spinner_1: Ora;

        const interval = setInterval(() => {
            if (counter === 3) {
                spinner.succeed(`[${chalk.hex('#7289DA')('Discord')}] Logged in as ${client.user!.tag}`)
                spinner_1 = ora({
                    text: `[${chalk.hex('#4DB33D')('Database')}] Logging in...`,
                    interval: 200
                }).start()
            } else if ( counter === 8) {
                spinner_1.succeed(`[${chalk.hex('#4DB33D')('Database')}] Logged in as rbxdiscord`)
                clearInterval(interval)
            }
            counter++;
        }, 200)
    }
)

export default ready