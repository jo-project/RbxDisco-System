import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import ora, { Ora} from 'ora';
import chalk from "chalk";
import { ActivityType } from "discord.js";
import { createReady } from "../../extensions/createReady.js";


const ready = new EventBuilder(true)
.setName('ready')
.setCallback(
    async(client: Bot) => {
        await client.registerCommands();

        const { data: { login }, } = await client.octokit.rest.users.getAuthenticated();

        const spinner = createReady(
            {
                name: 'Discord',
                color: '#7289DA',
                counter: 3,
                account: client.user!.tag
            },
            {
                name: 'Database',
                color: '#4DB33D',
                counter: 8,
                account: 'rbxdiscord'
            },
            {
                name: 'Github',
                color: '#DB5A6B',
                counter: 13,
                account: login
            }
        )

        await client.setPresence({
            activities: [{
                name: client.shardCount > 1 ? `${client.shardCount} shards` : `${client.shardCount} shard`,
                type: ActivityType.Watching
            }]
        })
    }
)

export default ready