import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import ora, { Ora} from 'ora';
import chalk from "chalk";


const ready = new EventBuilder(true)
.setName('ready')
.setCallback(
    async(client: Bot) => {
        await client.registerCommands();

        const { data: { login }, } = await client.octokit.rest.users.getAuthenticated();

        const spinner = ora({
            text: `[${chalk.hex('#7289DA')('Discord')}] Logging in...`,
            interval: 200
        }).start()

        let counter = 0;
        var spinner_1: Ora;
        var spinner_2: Ora;

        const interval = setInterval(() => {
            if (counter === 3) {
                spinner.succeed(`[${chalk.hex('#7289DA')('Discord')}] Logged in as ${client.user!.tag}`)
                spinner_1 = ora({
                    text: `[${chalk.hex('#4DB33D')('Database')}] Logging in...`,
                    interval: 200
                }).start()
            } else if ( counter === 8) {
                spinner_1.succeed(`[${chalk.hex('#4DB33D')('Database')}] Logged in as rbxdiscord`)
                spinner_2 = ora({
                    text: `[${chalk.hex('#db5a6b')('Github')}] Logging in...`,
                    interval: 200
                }).start()
            } else if (counter === 13) {
                spinner_2.succeed(`[${chalk.hex('#db5a6b')('Github')}] Logged in as ${login}`)
                clearInterval(interval)
            }
            counter++;
        }, 200)
    }
)

export default ready