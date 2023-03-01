import { ChatInputCommandInteraction, ModalBuilder, TextInputBuilder,ActionRowBuilder, EmbedBuilder, TextInputStyle, TextChannel, WebhookClient } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { channelList } from "../../config/channelList.config.js";
import { Bot } from "../../structures/bot.js";
import { getDiscordMessageInfo } from "../../extensions/check.js";

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
    .setDescription('Add a post on announcements channel')
    .setLevel(2)
)
.addSubcommand(options => options
    .setName('delete')
    .setLevel(3)
    .setDescription('Delete a post on announcements channel')
    .addStringOption(opt => opt
        .setName('message_link_or_id')
        .setDescription('Message link or id to delete')
        .setRequired(true)
    )
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
        } else if (sub === 'delete') {
            await interaction.deferReply({ ephemeral: true })
            const linkId = options.getString('message_link_or_id')!
            const messageData = getDiscordMessageInfo(linkId)
            const targetChannel = interaction.guild!.channels.cache.get(messageData.channelId!) as TextChannel
            const targetMessage = await targetChannel.messages.fetch(messageData.messageId!);
            const delMsg = await targetMessage.delete();

            const privateEmbed = new EmbedBuilder()
            .setTitle('Success')
            .setColor(0x198754)
            .setDescription(`\`\`\`You have deleted a post\`\`\``)
            .setTimestamp()
            .setFooter({ text: interaction.user!.username, iconURL: client.user!.displayAvatarURL({ size: 1024, extension: 'png'}) || ''})

            const newEmbed = new EmbedBuilder()
            .setTitle('Message Deleted')
            .setColor(0x819CFF)
            .setDescription(`<@${user.id}> **has deleted a post**`)
            .addFields(
                {
                    name: 'Author',
                    value: delMsg.author.tag
                },
                {
                    name: 'Title',
                    value: delMsg.embeds[0].title!
                },
                {
                    name: 'Description',
                    value: delMsg.embeds[0].description!
                }
            )
            .setTimestamp()
            .setFooter({ text: interaction.guild!.name,  iconURL: interaction.guild!.iconURL({ size: 1024, extension: 'png' }) || ''})
            
            const msgLog = await interaction.guild!.channels.cache.get(`1080577147124580442`) as TextChannel
            await msgLog.send({
                embeds: [newEmbed]
            })

            return interaction.editReply({
                embeds: [privateEmbed]
            })
        }
    }
)

export default post