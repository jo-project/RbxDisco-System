import axios from 'axios';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandBuilder } from 'discordbuilder.js'
import { Bot } from '../../structures/bot.js'

const lovequote = new CommandBuilder()
.setName('lovequote')
.setDescription('Generate a random love quote')
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.setClass('Member')
.setLevel(1)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply()
        const url = `https://api.quotable.io/random`

        const quoteData = await axios.get(url, {
            params: {
                tags: 'love'
            }
        })
        const quote = quoteData.data
        const quoteText = quote.content

        const newEmbed = new EmbedBuilder()
        .setAuthor({ 
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL({ extension: 'png'}) || ''
        })
        .setDescription(quoteText)
        .setTitle(`Love Quote`)
        .setTimestamp()
        .setFooter({
            text: `${interaction.guild!.name}`,
            iconURL: interaction.guild!.iconURL({ extension: 'png' }) || ''
        })

        return interaction.editReply({ embeds: [newEmbed] })
    }
)

export default lovequote