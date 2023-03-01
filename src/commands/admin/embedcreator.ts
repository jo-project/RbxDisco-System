import { ChatInputCommandInteraction, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ColorResolvable, resolveColor } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const embedcreator = new CommandBuilder()
.setName('embedcreator')
.setDescription('Create your own embed')
.setLevel(3)
.setClass('Head Administrator')
.setCategory({
    name: 'Administration',
    emoji: '<:administration:1071160563813593109>'
})
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        const modal = new ModalBuilder()
        .setTitle('Embed Creator')
        .setCustomId('embed-creator')

        const title = new TextInputBuilder()
        .setCustomId('embed-title')
        .setRequired(false)
        .setLabel('Embed Title')
        .setStyle(TextInputStyle.Short)

        const desc = new TextInputBuilder()
        .setCustomId('embed-description')
        .setRequired(false)
        .setLabel('Embed Description')
        .setStyle(TextInputStyle.Paragraph)

        const color = new TextInputBuilder()
        .setCustomId('embed-color')
        .setRequired(false)
        .setLabel('Embed Color')
        .setStyle(TextInputStyle.Short)

        const image = new TextInputBuilder()
        .setCustomId('embed-image')
        .setRequired(false)
        .setLabel('Embed Image')
        .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder().addComponents(title)
        const secondRow = new ActionRowBuilder().addComponents(desc)
        const thirdRow = new ActionRowBuilder().addComponents(color)
        const fourthRow = new ActionRowBuilder().addComponents(image)

        //@ts-ignore
        modal.addComponents(firstRow, secondRow, thirdRow, fourthRow)
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
            const title = submitted.fields.getTextInputValue('embed-title');
            const desc = submitted.fields.getTextInputValue('embed-description');
            const color = submitted.fields.getTextInputValue('embed-color');
            const image = submitted.fields.getTextInputValue('embed-image');

            const newEmbed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({
                text: interaction.guild!.name,
                iconURL: interaction.guild!.iconURL({ extension: 'png' }) || ''
            })
            if (title) newEmbed.setTitle(title)
            if (desc) newEmbed.setDescription(desc)
            if (color) newEmbed.setColor(`#${color}`)
            if (image) newEmbed.setImage(image)

            await submitted.reply({ 
                embeds: [newEmbed]
            })
            
        }
    }
)

export default embedcreator