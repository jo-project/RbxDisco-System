import { ChatInputCommandInteraction, EmbedBuilder, Interaction, InteractionType } from "discord.js";
import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const interactionCreate = new EventBuilder(false)
.setName('interactionCreate')
.setCallback(
    async(client: Bot, interaction: Interaction) => {
        if (interaction.type == InteractionType.ModalSubmit) {
        }
    }
)

export default interactionCreate