import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, AttachmentBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import VerificationSchema from '../../models/data/verification.js'
import { Captcha } from "captcha-canvas";

const share = new CommandBuilder()
.setName('share')
.setDescription('Share server setup')
.setClass('Developer')
.setLevel(5)
.setCategory({
    name: 'Developer',
    emoji: '<:dev:1071162053319991398>'
})
.addSubcommand(opt => opt
    .setName('verification')
    .setDescription('Share verfication setup')
    .setLevel(5)
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild, guildId } = interaction;
        const subCommand = options.getSubcommand();

        if (subCommand === 'verification') {
            const captcha = new Captcha()
            const verificationData = await VerificationSchema.findById(guildId!)

            if (verificationData) {
                if (verificationData.channel && verificationData.role) {
                    const embed = new EmbedBuilder()
                    .setTitle('Verification System')
                    .setDescription('Please verify to get access to other channels')
                    .setColor(0x7289DA)
                    .setFooter({
                        text: guild!.name,
                        iconURL: guild!.iconURL({ extension: 'png' }) || ''
                    })

                    const verificationBtn = new ButtonBuilder()
                    .setCustomId(`v_verify`)
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("1073399784712450069")

                    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(verificationBtn)
                    const verificationChannel = guild!.channels.cache.get(verificationData.channel);
                    if (verificationChannel?.type === ChannelType.GuildText) {
                        const succEmbed = new EmbedBuilder()
                        .setTitle('Success')
                        .setColor(0x198754)
                        .setDescription(`Successfully shared verification setup to ${verificationChannel}`)
                        .setTimestamp()
                        .setFooter({ text: guild!.name,  iconURL: guild!.iconURL({ size: 1024, extension: 'png' }) || ''})
                        interaction.reply({
                            ephemeral: true,
                            embeds: [succEmbed]
                        })
                        await verificationChannel.send({
                            embeds: [embed],
                            components: [row],
                        });

                        const collector = verificationChannel.createMessageComponentCollector();
                        collector.on('collect', async btn => {
                            if (btn.isButton()) {
                                if (btn.customId === 'v_verify') {
                                    const member = guild?.members.cache.get(btn.user.id)
                                    const hasRole = member?.roles.cache.some(role => role.id === verificationData.role)
                                    if (!hasRole) {
                                        captcha.async = true;
                                        captcha.addDecoy();
                                        captcha.drawTrace();
                                        captcha.drawCaptcha();
                            
                                        const captchaImage = new AttachmentBuilder(
                                        await captcha.png, { name: 'captcha.png'}
                                        );

                                        let cmsg = await btn.user.send({
                                            embeds: [
                                            new EmbedBuilder()
                                                .setColor(0x7289DA)
                                                .setTitle(`Captcha Verification`)
                                                .setImage(`attachment://captcha.png`),
                                            ],
                                            files: [captchaImage],
                                        });

                                        btn.reply({
                                            content: `**Check your direct message**`,
                                            ephemeral: true,
                                        });

                                        //@ts-ignore
                                        await cmsg.channel.awaitMessages({
                                            filter: (m) => m.author.id == interaction.user.id,
                                            max: 1,
                                            time: 1000 * 60,
                                            errors: ["time"],
                                        }).then(async (value) => {
                                            if (value) {
                                                let isValid = value.first()!.content == captcha.text;
                                                const verifyRole = guild!.roles.cache.get(verificationData.role);
                                                if (!verifyRole) return;

                                                if (isValid) {
                                                    await member!.roles.add(verifyRole).catch((e) => {});
                                                    btn.user.send({
                                                      content: `**You are now verified**`,
                                                    });
                                                }
                                            }
                                        })
                                    } else {
                                        await btn.reply({
                                            ephemeral: true,
                                            content: `**You are already verified**`
                                        });
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
    }
)

export default share
