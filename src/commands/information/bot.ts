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

            const guildSizeInit = await bot.cluster.broadcastEval(c => c.guilds.cache.size)
            const guildsInit = await bot.cluster.broadcastEval(c => c.guilds.cache)
            const guildSize = guildSizeInit.reduce((prev, val) => prev + val, 0)
            let memberCount = 0;
            guildsInit.forEach(guilds => {
                guilds.forEach(guild => {
                    memberCount += guild.memberCount
                })
            })

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
                    value: `> ${bot.user!.username}`,
                    inline: true
                },
                {
                    name: 'ID',
                    value: `> \`${bot.user!.id}\``,
                    inline: true
                },
                {
                    name: "Shards",
                    value: `> \`${bot.shardCount}\` ${bot.shardCount > 1 ? 'shards' : 'shard'}`,
                    inline: true
                },
                {
                    name: 'Owner',
                    value: `> <@${process.env.OWNER_ID!}>`,
                    inline: true
                },
                {
                    name: 'Developer',
                    value: `> <@${process.env.OWNER_ID!}>`,
                    inline: true
                },
                {
                    name: 'Commands',
                    value: `> \`${bot.commands.length}\` commands`,
                    inline: true
                },
                {
                    name: 'Servers',
                    value: `> \`${guildSize}\` ${guildSize > 1 ? 'servers' : 'server'}`,
                    inline: true
                },
                {
                    name: 'Members',
                    value: `> \`${memberCount}\` ${memberCount > 1 ? 'members' : 'member'}`,
                    inline: true
                },
            )

            const systemEmbed = new EmbedBuilder()
            .setAuthor({
                name: `System Stats`
            })
            .setDescription(stripIndents`\`\`\`json
            ${systemInfo}\`\`\``)
            .setColor(0x36393F)
            .setTimestamp()
            .setFooter({
                text: `\u00a9 ${bot.user!.username} 2023`,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })

            return interaction.editReply({ embeds: [botEmbed, systemEmbed]})
        }
    }
)

export default bot