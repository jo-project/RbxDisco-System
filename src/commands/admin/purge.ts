import { ChatInputCommandInteraction, ChannelType, Message, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const purge = new CommandBuilder()
.setName('purge')
.setDescription('Clean messages from a channel or a user')
.setClass('Administrator')
.setLevel(6)
.setCategory({
    name: 'Administration',
    emoji: '<:administration:1071160563813593109>'
})
.addIntegerOption(opt => opt
    .setName('amount')
    .setDescription('Amount of messages')
    .setRequired(false)
)
.addUserOption(opt => opt
    .setName('target')
    .setDescription('Target to clear the messages')
    .setRequired(false)
)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild, channel } = interaction;
        const amount = options.getInteger('amount') || 99;
        const user = options.getUser('target')

        if (channel) {
            if (channel.type === ChannelType.GuildText) {
                await interaction.deferReply({ ephemeral: true })
                const succEmbed = new EmbedBuilder()
                .setTitle('Success')
                .setColor(0x198754)
                .setTimestamp()
                .setFooter({
                    text: guild!.name,
                    iconURL: guild!.iconURL({ extension: 'png' }) || ''
                })

                const messages = await channel.messages.fetch({
                    limit: amount + 1
                })

                if (user) {
                    let i = 0;
                    const filtered: Message[] = [];
                    (await messages).filter((msg) => {
                        if (msg.author.id === user.id && amount > i) {
                            filtered.push(msg)
                            i++;
                        }
                    })

                    await channel.bulkDelete(filtered).then(messages => {
                        succEmbed.setDescription(`\`\`\`Successfully deleted ${messages.size} from ${user.tag}\`\`\``)
                    })
                } else {
                    await channel.bulkDelete(amount).then(messages => {
                        succEmbed.setDescription(`\`\`\`Successfully deleted ${messages.size} from this channel\`\`\``)
                    })
                }

                return interaction.editReply({ embeds: [succEmbed] })
            }
        }
    }
)

export default purge