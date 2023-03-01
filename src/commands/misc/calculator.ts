
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from '../../structures/bot.js';
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { evaluate } from "mathjs";

/**
 * Bot command to calculate simple math
 * @category Miscellaneous
 * @param {string} math - The math expression to evaluate.
 * @returns {Promise<void>} A promise that resolves when the interaction has been replied to.
 */
const calculator = new CommandBuilder()
.setName('calculator')
.setDescription('Calculate simple math')
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.setLevel(1)
.addStringOption(option => option
    .setName('math')
    .setDescription('Write the math')
    .setRequired(true)
)
.setCallback(
    /**
     * Callback function that executes when the command is invoked.
     * @param {Bot} client - Bot client
     * @param {ChatInputCommandInteraction} interaction - the interaction that triggered the command 
     * @returns 
     */
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;
        
        const math = options.getString('math')
        if (math) {
            const res = evaluate(math)
            if (res) {
                await interaction.deferReply({ ephemeral: true });
                const newEmbed = new EmbedBuilder()
                .setTitle(`Calculator`)
                .setColor(0x4295F5)
                .addFields(
                    {
                        name: 'Question',
                        value: math
                    },
                    {
                        name: 'Answer',
                        value: `${res}`
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: interaction.guild!.name,
                    iconURL: interaction.guild!.iconURL({ extension: 'png'}) || ''
                })

                return interaction.editReply({ embeds: [newEmbed]})
            }
        }
    }
)

export default calculator
