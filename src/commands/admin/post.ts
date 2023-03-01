import { ChatInputCommandInteraction, ModalBuilder, TextInputBuilder,ActionRowBuilder, EmbedBuilder, TextInputStyle, TextChannel, WebhookClient } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { channelList } from "../../config/channelList.config.js";
import { Bot } from "../../structures/bot.js";

const post = new CommandBuilder()
.setName('post')
.setDescription('Post command')
.setLevel(2)
.setClass('Administrator')
.setCategory({
    name: 'Administration',
    emoji: '<:administration:1071160563813593109>'
})
.addSubcommand(options => options
    .setName('add')
    .setDescription('Add a post to announcements channel')
    .setLevel(2)
)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, user } = interaction;
        
        const sub = options.getSubcommand()
        if (sub === 'add') {
            const modal = new ModalBuilder()
            .setTitle('Create Post')
            .setCustomId('post-create')

            const title = new TextInputBuilder()
            .setCustomId('post-title')
            .setRequired(false)
            .setLabel('Announcement Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

            const desc = new TextInputBuilder()
            .setCustomId('post-description')
            .setLabel('Announcement Message')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)

            const signed = new TextInputBuilder()
            .setCustomId('post-signed')
            .setLabel('Signed by')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

            const webhook = new TextInputBuilder()
            .setCustomId('post-webhook')
            .setLabel('Use Webhook')
            .setPlaceholder('User true/false (default: false)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

            const titleRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(title)

            const descRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(desc)

            const signedRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(signed)

            const webhookRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(webhook)

            modal.addComponents(titleRow, descRow, signedRow, webhookRow)
            await interaction.showModal(modal)

            const submitted = await interaction.awaitModalSubmit({
                // Timeout after a minute of not receiving any valid Modals
                time: 60000,
                // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
                filter: i => i.user.id === interaction.user.id,
            }).catch(error => {
                // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
                console.error(error)
                return null
            })

            if (submitted) {
                const title = submitted.fields.getTextInputValue('post-title');
                const desc = submitted.fields.getTextInputValue('post-description');
                const signed = submitted.fields.getTextInputValue('post-signed');
                const webhook = submitted.fields.getTextInputValue('post-webhook');

                const newEmbed = new EmbedBuilder()
                .setTimestamp()
                .setFooter({
                    text: interaction.guild!.name,
                    iconURL: interaction.guild!.iconURL({ extension: 'png' }) || ''
                })
                .setAuthor({
                    name: user.tag,
                    iconURL: user.displayAvatarURL({ extension: 'png' })
                })
                .setColor(0x819CFF)
                if (title) newEmbed.setTitle(title)
                if (desc) {
                    if (signed !== '' || signed !== undefined || signed !== null) {
                        newEmbed.setDescription(`${desc}
                        
                        *Signed by,*
                        __${signed}__`)
                    } else {
                        newEmbed.setDescription(`${desc}
                        
                        *Signed by,*
                        __${user}__`)
                    }
                }

                if (webhook && webhook.toLowerCase() === 'true') {
                    const webhookClient = new WebhookClient({ id: `1080563728782729338`, token: `4HIZ38NcDB1uUzUyVERaF7inYj0ohNrw3MIjxLG4RFxJGFgoZlLn3ioNOZW-Sbd1O5wQ` });
                    webhookClient.send({
                        embeds: [newEmbed]
                    })
                } else {
                    const announcementChannel = await interaction.guild!.channels.cache.get(channelList.announcement) as TextChannel
                    if (announcementChannel) {
                        await announcementChannel.send({
                            embeds: [newEmbed]
                        })
                    }
                }

                await submitted.reply({
                    ephemeral: true, 
                    content: `You have post an announcement`
                })
                
            }
        }
    }
)

export default post