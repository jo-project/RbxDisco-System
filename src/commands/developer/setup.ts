import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import VerificationSchema from '../../models/data/verification.js'

const setup = new CommandBuilder()
.setName('setup')
.setDescription('Setup the server')
.setClass('Developer')
.setLevel(5)
.setCategory({
    name: 'Developer',
    emoji: '<:dev:1071162053319991398>'
})
.addSubcommand(opt => opt
    .setName('verify')
    .setDescription('Setup the verification system')
    .setLevel(5)
    .addRoleOption(opt => opt
        .setName('role')
        .setDescription('Set the verification role')
        .setRequired(true)
    )
    .addChannelOption(opt => opt
        .setName('channel')
        .setDescription('Set the verification channel')
        .setRequired(true)
    )
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild, guildId } = interaction;
        const subCommand = options.getSubcommand();

        if (subCommand === 'verify') {
            const verifyRole = options.getRole('role');
            const verifyChannel = options.getChannel('channel');
            await interaction.deferReply()
            if (verifyRole && verifyChannel) {
                const verificationData = await VerificationSchema.findById(guildId!) || new VerificationSchema({
                    _id: guildId!
                })

                if (!verificationData.role && !verificationData.channel) {
                    verificationData.role = verifyRole.id
                    verificationData.channel = verifyChannel.id
                    verificationData.save();

                    const succEmbed = new EmbedBuilder()
                    .setTitle('Success')
                    .setColor(0x198754)
                    .setDescription(`You have successfully set verification role and verification channel`)
                    .addFields(
                        {
                            name: 'Role',
                            value: `<@&${verificationData.role}>`
                        },
                        {
                            name: 'Channel',
                            value: `<#${verificationData.channel}>`
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: guild!.name,  iconURL: guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                    return interaction.editReply({
                        embeds: [succEmbed]
                    })
                } else {
                    const errEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setColor(0xB12626)
                    .setDescription(`You already set verification role and verification channel`)
                    .addFields(
                        {
                            name: 'Role',
                            value: `<@&${verificationData.role}>`
                        },
                        {
                            name: 'Channel',
                            value: `<#${verificationData.channel}>`
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: guild!.name,  iconURL: guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                    return interaction.editReply({ embeds: [errEmbed] })
                }
            }
        }
    }
)

export default setup
