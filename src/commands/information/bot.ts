import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import moment from 'moment'
import 'moment-duration-format'

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
        }
    }
)

export default bot