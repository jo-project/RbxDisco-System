import axios from 'axios';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandBuilder } from 'discordbuilder.js'
import { Bot } from '../../structures/bot.js'

const rps = new CommandBuilder()
.setName('rps')
.setDescription('Play rock paper scissors with the bot')
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.setClass('Member')
.setLevel(1)
.addStringOption(opt => opt
    .setName('choice')
    .setDescription('Your choice (with select choices)')
    .setRequired(true)
    .addChoices(
        {
            name: 'Rock',
            value: 'rock'
        },
        {
            name: 'Paper',
            value: 'paper'
        },
        {
            name: 'Scissors',
            value: 'scissors'
        }
    )
)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply()
        const botAnswer = Math.floor(Math.random() * 2) + 1;
        var botChoice: string = '';
        const { options, user } = interaction;
        const userChoice = options.getString('choice')!;
        var botChoiceStr: string  = '';
        var userChoiceStr: string = '';
        var condition: string = '';
        if (botAnswer == 1) {
            botChoice = 'rock'
            botChoiceStr = 'Rock'
        } else if (botAnswer == 2) {
            botChoice = 'paper'
            botChoiceStr = 'Paper'
        } else if (botAnswer == 3) {
            botChoice = 'scissors'
            botChoiceStr = 'Scissors'
        }

        if (userChoice === 'rock') {
            userChoiceStr = 'Rock'
            if (botChoice == 'paper') {
                condition = 'lose'
            } else if (botChoice == 'rock') {
                condition = 'even'
            } else if (botChoice == 'scissors') {
                condition = 'won'
            }
        } else if (userChoice === 'paper') {
            userChoiceStr = 'Paper'
            if (botChoice == 'paper') {
                condition = 'even'
            } else if (botChoice == 'rock') {
                condition = 'won'
            } else if (botChoice == 'scissors') {
                condition = 'lose'
            }
        } else if (userChoice === 'scissors') {
            userChoiceStr = 'Scissors'
            if (botChoice == 'paper') {
                condition = 'won'
            } else if (botChoice == 'rock') {
                condition = 'lose'
            } else if (botChoice == 'scissors') {
                condition = 'even'
            }
        }

        console.log(userChoiceStr)

        const embed = new EmbedBuilder()
        .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ extension: 'png' }) || ''
        })
        .setTitle('Rock Paper Scissors')
        .setDescription(`I picked: **${botChoiceStr}**, you picked: **${userChoiceStr}**. ${condition === 'even' ? 'We are even.' : condition === 'won' ? 'You won.' : 'You lose.'}`)
        .setColor(0x32a852)
        .setTimestamp()
        .setFooter({
            text: client.user!.tag,
            iconURL: client.user!.displayAvatarURL({ extension: 'png'}) || ''
        })

        return interaction.editReply({ embeds: [embed] })
    }  
)

export default rps