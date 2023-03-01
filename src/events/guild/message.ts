import { Message } from "discord.js";
import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const regex = /\[`(.*)`\]\((.*)\) (.*) - (.*)/;

const message = new EventBuilder(false)
.setName('messageCreate')
.setCallback(
    async(client: Bot, message: Message) => {
        if (message.channelId === `1080544269011529808`) {
            console.log(message.content)
            const postEmbed = message.embeds[0]
            const str = postEmbed.description!
            const matches = str.match(regex);

            if (matches) {
                const id = matches[1];
                const link = matches[2];
                const message = matches[3];
                const author = matches[4];

                console.log(`ID: ${id}`);
                console.log(`Link: ${link}`);
                console.log(`Message: ${message}`);
                console.log(`Author: ${author}`);
            }
        }
    }
)

export default message