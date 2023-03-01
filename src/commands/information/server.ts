import { channel } from "diagnostics_channel";
import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import InviteSchema from '../../models/data/invite.js';
import { Bot } from "../../structures/bot.js";
import { EmbedService } from "../../services/embed.js";

const server = new CommandBuilder()
.setName('server')
.setDescription('Check everything about this server')
.setLevel(0)
.setCategory({
    name: 'Information',
    emoji: '<:info:1072994286645280818>'
})
.addSubcommand(opt => opt
    .setName('link')
    .setDescription('Invite link for this server')
    .setLevel(0)
)
.addSubcommand(opt => opt
    .setName('rules')
    .setDescription('Rules of this server')
    .setLevel(0)
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild, user } = interaction;
        const sub = options.getSubcommand()
        if (sub === 'link') {
            const data = await InviteSchema.findById(guild!.id) || new InviteSchema({
                _id: guild!.id
            })

            if (!data.link) {
                const member = guild!.members.cache.get(user.id)
                if (member!.permissions.has(PermissionFlagsBits.CreateInstantInvite)) {
                    const channel = guild!.channels.cache.get(`1065853018211369060`)
                    if (channel) {
                        if (channel.type === ChannelType.GuildText) {
                            let invite = await channel.createInvite({
                                maxAge: 0,
                                maxUses: 0,
                            });

                            data.link = `https://discord.gg/${invite.code}`
                            data.save();
                        }
                    }
                } else {
                    await interaction.deferReply({ ephemeral: true })
                    const errEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL({ extension: 'png'}) || `https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3`
                    })
                    .setTitle('Warning - Insufficient Permission')
                    .setColor(0xB12626)
                    .setDescription(`This server does not have invite link yet, you don't have permission to create invite link!`)
                    .setTimestamp()
                    .setFooter({ text: interaction.guild!.name,  iconURL: interaction.guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                    return interaction.editReply({ embeds: [errEmbed] })
                }
            }

            await interaction.deferReply()
            const Embed = new EmbedBuilder()
            .setTitle('Invite Link')
            .setColor(0x4983ff)
            .setURL(data.link)
            .setDescription(data.link)
            .setTimestamp()
            .setFooter({
                text: bot.user!.tag,
                iconURL: bot.user!.avatarURL({ extension: 'png' }) || ''
            })

            return interaction.editReply({
                embeds: [Embed]
            })
        } else if (sub === 'rules') {
            const embedService = new EmbedService(guild!)
            const bannerImage = 'https://media.discordapp.net/attachments/1072938695956643920/1072972875042148443/Rules_Ban.png';
            await interaction.deferReply({ fetchReply: true})
            const rulesEmbed = await embedService.sendMultipleEmbeds([
                {
                    image: bannerImage,
                    color: 0x49bcb5,
                },
                {
                    title: `📃・Rules`,
                    description: `These are our server rules. Please stick to this to keep it fun for everyone. The Admins and Mods will Timeout/Kick/Ban per discretion`,
                    color: 0x49bcb5,
                    fields: [
                        {
                            name: '1. Be respectful',
                            value: `You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.`
                        },
                        {
                            name: '2. No Inappropriate Language',
                            value: `The use of profanity should be kept to a minimum. However, any derogatory language towards any user is prohibited.`
                        }
                    ],
                    timestamp: true,
                    defaultFooter: true
                }
            ])

            await interaction.editReply({ embeds: rulesEmbed })
        }
    }
)

export default server