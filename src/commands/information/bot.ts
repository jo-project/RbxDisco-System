import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import moment from 'moment'
import 'moment-duration-format'
import { checkSystem } from "../../extensions/check.js";
import { stripIndents } from 'common-tags'

const bot = new CommandBuilder()
.setName('bot')
.setDescription('Check everything about this server')
.setLevel(0)
.setCategory({
    name: 'Information',
    emoji: '<:info:1072994286645280818>'
})
.addSubcommand(opt => opt
    .setName('uptime')
    .setDescription('Invite link for this server')
    .setLevel(0)
)
.addSubcommand(opt => opt
    .setName('info')
    .setDescription('Get information about the bot')
    .setLevel(0)
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild } = interaction;
        const sub = options.getSubcommand()
        await interaction.deferReply()
        if (sub === 'uptime') {
            const duration = moment.duration(bot.uptime!);
            const durationString = duration.format("\`D\` [days], \`H\` [hrs], \`m\` [mins], \`s\` [secs]");
            const upvalue = (Date.now() / 1000 - bot.uptime! / 1000).toFixed(0);

            const timeEmbed = new EmbedBuilder()
            .setTitle('⬆️・Bot Uptime')
            .setDescription(`See the uptime of Bot`)
            .setColor(0x7289DA)
            .addFields({
                name: '⌛┇Uptime',
                value: `${durationString}`,
                inline: true
            }, {
                name: '⏰┇Up Since',
                value: `<t:${upvalue}>`,
                inline: true
            })
            .setTimestamp()
            .setFooter({
                text: guild!.name,
                iconURL: guild!.iconURL({ extension: 'png' }) || ''
            })

            return interaction.editReply({ embeds: [timeEmbed] })
        } else if (sub === 'info') {
            const systemInfo = await checkSystem()

            const botEmbed = new EmbedBuilder()
            .setAuthor({
                name: bot.user!.username,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })
            .setTitle(`What is ${bot.user!.username}?`)
            .setDescription(stripIndents`**__About ${bot.user!.username}__**
            >>> <@${bot.user!.id}> is a multipurpose bot to help you run the **__server__**!
            With more than 50 commands, we have a functional bot with many features to improve your server!`)
            .setThumbnail(bot.user!.displayAvatarURL({ extension: 'png' }))
            .setColor(0x36393F)
            .addFields(
                {
                    name: 'Name',
                    value: `> ${bot.user!.username}`
                },
                {
                    name: 'ID',
                    value: `> ${bot.user!.id}`
                }
            )

            const systemEmbed = new EmbedBuilder()
            .setAuthor({
                name: `System Stats`
            })
            .setDescription(stripIndents`\`\`\`json
            ${systemInfo}\`\`\``)
            .setColor(0x36393F)

            return interaction.editReply({ embeds: [botEmbed, systemEmbed]})
        }
    }
)

export default bot