import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import moment from 'moment'
import 'moment-duration-format'
import { checkSystem } from "../../extensions/check.js";
import { stripIndents } from 'common-tags';
import { snowflakeToDate, dateToUnix } from "../../extensions/convert.js";
import { checkVersion } from "../../extensions/check.js";
import mongoose from "mongoose";
import { logs } from "../../config/bot.config.js";

const bot = new CommandBuilder()
.setName('bot')
.setDescription('Check everything about this server')
.setLevel(0)
.setCategory({
    name: 'Information',
    emoji: '<:info:1072994286645280818>'
})
.addSubcommand(opt => opt
    .setName('info')
    .setDescription('Get information about the bot')
    .setLevel(0)
)
.addSubcommand(opt => opt
    .setName('ping')
    .setDescription('Get ping of the bot')
    .setLevel(0)
)
.addSubcommand(opt => opt
    .setName('changelogs')
    .setDescription('View changelogs of the bot')
    .setLevel(0)
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild } = interaction;
        const sub = options.getSubcommand()
        await interaction.deferReply()
        if (sub === 'info') {
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

            const discordAccountTimestamp = snowflakeToDate(bot.user!.id)
            const discordAge = dateToUnix(discordAccountTimestamp, false)

            const duration = moment.duration(bot.uptime!);
            const durationString = duration.format("\`D\` [days], \`H\` [hrs], \`m\` [mins], \`s\` [secs]");

            const version = await checkVersion();
            
            const botEmbed = new EmbedBuilder()
            .setAuthor({
                name: bot.user!.username,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })
            .setTitle(`<:bot:1081005591163572305> <:arrow:1080943378713284648> What is ${bot.user!.username}?`)
            .setDescription(stripIndents`**__About ${bot.user!.username}__**
            >>> <@${bot.user!.id}> is a multipurpose bot to help you run the **__server__**!
            With **50+** commands, we have a functional bot with many features to improve your server!`)
            .setThumbnail(bot.user!.displayAvatarURL({ extension: 'png' }))
            .setColor(0x65c4c0)
            .addFields(
                {
                    name: '<:person:1080942557695049748> <:arrow:1080943378713284648> Name',
                    value: `> ${bot.user!.username}`,
                    inline: true
                },
                {
                    name: '<:bot_id:1080943822013472768> <:arrow:1080943378713284648> ID',
                    value: `> \`${bot.user!.id}\``,
                    inline: true
                },
                {
                    name: "<:shards:1081004296159625216> <:arrow:1080943378713284648> Shards",
                    value: `> \`${bot.shardCount}\` ${bot.shardCount > 1 ? 'shards' : 'shard'}`,
                    inline: true
                },
                {
                    name: '<:owner:1080996570029379684> <:arrow:1080943378713284648> Owner',
                    value: `> <@${process.env.OWNER_ID!}>`,
                    inline: true
                },
                {
                    name: '<:developer:1080996566279667752> <:arrow:1080943378713284648> Developer',
                    value: `> <@${process.env.OWNER_ID!}>`,
                    inline: true
                },
                {
                    name: '<:commands:1080994586803056750> <:arrow:1080943378713284648> Commands',
                    value: `> \`${bot.commands.length}\` commands`,
                    inline: true
                },
                {
                    name: '<:server:1080995483104850020> <:arrow:1080943378713284648> Servers',
                    value: `> \`${guildSize}\` ${guildSize > 1 ? 'servers' : 'server'}`,
                    inline: true
                },
                {
                    name: '<:members:1080998944697495582> <:arrow:1080943378713284648> Members',
                    value: `> \`${memberCount}\` ${memberCount > 1 ? 'members' : 'member'}`,
                    inline: true
                },
                {
                    name: '<:calendar_time:1080999524530667600> <:arrow:1080943378713284648> Created at',
                    value: `> <t:${discordAge}>`,
                    inline: true
                },
                {
                    name: '<:uptime:1080998941287530636> <:arrow:1080943378713284648> Uptime',
                    value: `> ${durationString}`,
                    inline: true
                },
                {
                    name: '<:api:1080994328811417631> <:arrow:1080943378713284648> API Speed',
                    value: `> \`${bot.ws.ping}\` ms`,
                    inline: true
                },
                {
                    name: '<:version:1081004797433491456> <:arrow:1080943378713284648> Version',
                    value: `> \`${version.bot}\``,
                    inline: true
                },
                {
                    name: '<:coding:1080993657961840650> <:arrow:1080943378713284648> Language',
                    value: `> <:typescript:1080939281218031706>`,
                    inline: true
                },
                {
                    name: '<:nodejs:1080992170212859926> <:arrow:1080943378713284648> Node.js Version',
                    value: `> \`${version.node}\``,
                    inline: true
                },
                {
                    name: '<:discordjs:1080992792903438427> <:arrow:1080943378713284648> Discord.js Version',
                    value: `> \`${version.framework}\``,
                    inline: true
                }
            )

            const systemEmbed = new EmbedBuilder()
            .setAuthor({
                name: `Stats`,
                iconURL: `https://cdn.discordapp.com/attachments/1072938695956643920/1081002109157257317/computers.png`
            })
            .setDescription(stripIndents`\`\`\`json
            ${systemInfo}\`\`\``)
            .setColor(0x65c4c0)
            .setTimestamp()
            .setFooter({
                text: `\u00a9 ${bot.user!.username} 2023`,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })

            return interaction.editReply({ embeds: [botEmbed, systemEmbed]})
        } else if (sub === 'ping') {
            const reply = await interaction.fetchReply();
            const db = mongoose.connection;
            let dbSpeed = 0;

            const resDb = await mongoose.connection.db.admin().ping()
            dbSpeed = resDb.ok

            const ping = reply.createdTimestamp - interaction.createdTimestamp;
            const botEmbed = new EmbedBuilder()
            .setAuthor({
                name: bot.user!.username,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })
            .setTitle(`<:network:1081063340966690886> <:arrow:1080943378713284648> ${bot.user!.username} Ping`)
            .setColor(0x65c4c0)
            .addFields(
                {
                    name: '<:list:1081063893037760612> <:arrow:1080943378713284648> Bot Latency',
                    value: `\`\`\`+ ${ping}ms (${ping/1000}s)\`\`\``,
                    inline: true
                },
                {
                    name: '<:list:1081063893037760612> <:arrow:1080943378713284648> API Latency',
                    value: `\`\`\`+ ${Math.round(bot.ws.ping)}ms (${bot.ws.ping / 1000}s)\`\`\``,
                    inline: true
                },
                {
                    name: '<:list:1081063893037760612> <:arrow:1080943378713284648> Database Latency',
                    value: `\`\`\`+ ${dbSpeed}ms (${dbSpeed / 1000}s)\`\`\``,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({
                text: `\u00a9 ${bot.user!.username} 2023`,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })

            return interaction.editReply({ embeds: [botEmbed] })
        } else if (sub === 'changelogs') {
            const botEmbed = new EmbedBuilder()
            .setAuthor({
                name: bot.user!.username,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })
            .setTitle(`<:log:1081073311414497321> <:arrow:1080943378713284648> Changelogs`)
            .setDescription(`>>> This is the changelogs of **${bot.user!.username}**, here you can see the changelogs that have been made!`)
            .setColor(0x65c4c0)
            .setThumbnail(bot.user!.displayAvatarURL({ extension: 'png'}))
            .addFields(
                logs.map(data => {
                    return {
                        name: data.date,
                        value: `>>> ${data.message}`,
                        inline: true
                    }
                })
            )
            .setTimestamp()
            .setFooter({
                text: `\u00a9 ${bot.user!.username} 2023`,
                iconURL: bot.user!.displayAvatarURL({ extension: 'png' })
            })

            return interaction.editReply({ embeds: [botEmbed] })
        }
    }
)

export default bot