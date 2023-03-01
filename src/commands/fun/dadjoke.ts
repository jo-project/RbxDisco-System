import fetch from 'node-fetch';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandBuilder } from 'discordbuilder.js'
import { Bot } from '../../structures/bot.js'

const dadjoke = new CommandBuilder()
.setName('dadjoke')
.setDescription('Generate a random dad joke')
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.setClass('Member')
.setLevel(1)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply()
        const url = `https://icanhazdadjoke.com/`

        const jokeData = await fetch(url, {
            headers: {
                Accept: "application/json"
            }
        })

        const joke: any = await jokeData.json()
        const jokeId = joke.id
        const jokeText = joke.joke

        const jokeImage = `https://icanhazdadjoke.com/j/${jokeId}.png`

        const newEmbed = new EmbedBuilder()
        .setAuthor({ 
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL({ extension: 'png'}) || ''
        })
        .setDescription(jokeText)
        .setTitle(`Dad Joke`)
        .setImage(jokeImage)
        .setTimestamp()
        .setFooter({
            text: `${interaction.guild!.name}`,
            iconURL: interaction.guild!.iconURL({ extension: 'png' }) || ''
        })

        return interaction.editReply({ embeds: [newEmbed] })
    }
)

export default dadjoke