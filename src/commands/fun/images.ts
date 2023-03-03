import canvacord from "canvacord";
import { ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const images = new CommandBuilder()
.setName('images')
.setDescription('Images command')
.setLevel(1)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.addSubcommand(opt => opt
    .setName('youtube')
    .setDescription('Generate youtube command styled images')
    .setLevel(1)
    .addStringOption(opt => opt
        .setName('text')
        .setDescription('Set the comment for your image')
        .setRequired(true)
    )
)
.addSubcommand(opt => opt
    .setName('qrcode')
    .setDescription('Generate qrcode from text')
    .setLevel(1)
    .addStringOption(opt => opt
        .setName('text')
        .setDescription('Set the text for your qrcode')
        .setRequired(true)
    )
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, user } = interaction;
        const sub = options.getSubcommand();

        await interaction.deferReply()
        if (sub === 'youtube') {
            const text = options.getString('text')!
            const image = await canvacord.Canvas.youtube({
                username: user.username,
                avatar: user.displayAvatarURL({ extension: "png" }),
                content: text
            });

            const attachment = new AttachmentBuilder(image, {
                name: 'ytb-comment.png'
            })

            return interaction.editReply({
                files: [attachment]
            })
        } else if (sub === 'qrcode') {
            const text = options.getString('text')!

            const embed = new EmbedBuilder()
            .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(new RegExp(" ", "g"), "%20")}`)
            .setColor(0x65c4c0)

            return interaction.editReply({
                embeds: [embed]
            })
        }
    }
)

export default images