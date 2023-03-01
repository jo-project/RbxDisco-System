import { Message } from "discord.js";
import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const message = new EventBuilder(false)
.setName('messageCreate')
.setCallback(
    async(client: Bot, message: Message) => {
        if (message.channelId === `1080544269011529808`) {
            console.log(message.content)
            console.log(message.embeds)
        }
    }
)

export default message