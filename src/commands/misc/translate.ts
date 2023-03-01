import Translate from '@iamtraction/google-translate';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandBuilder } from 'discordbuilder.js';
import { Bot } from '../../structures/bot.js';
import ISO6391 from 'iso-639-1'

const translate = new CommandBuilder()
.setName('translate')
.setDescription('Translate command')
.setLevel(1)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.addStringOption(opt => opt
    .setName('target_language')
    .setDescription('Language of the output (ISO-639-1)')
    .setRequired(true)
)
.addStringOption(opt => opt
    .setName('query')
    .setDescription('Text to translate')
    .setRequired(true)
)
.addStringOption(opt => opt
    .setName('source_language')
    .setDescription('Language of the input (ISO-639-1) (English as default)')
    .setRequired(false)
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const language = interaction.options.getString('target_language');
        const text = interaction.options.getString('query');
        const source = interaction.options.getString('source_language') || 'en'
        var sourceCode: string = ISO6391.getCode(source);
        var targetCode: string = ISO6391.getCode(language!);
        var allowedSource = false
        var allowedTarget = false

        if (sourceCode === '') {
            const textCode = ISO6391.getName(source)
            if (textCode !== '') {
                allowedSource = true
                sourceCode = source
            }
        } else {
            allowedSource = true
        }

        if (targetCode === '') {
            const textCode = ISO6391.getName(language!)
            if (textCode !== '') {
                allowedTarget = true
                targetCode = language!
            }
        } else {
            allowedTarget = true
        }

        if (allowedSource && allowedTarget) {
            const res = await Translate(text!, { to: targetCode!, from: sourceCode})
            if (res) {
                await interaction.deferReply()
                var flagSource: string = ''
                var flagTarget: string = ''
                var sourceLanguage = ISO6391.getName(sourceCode)
                var targetLanguage = ISO6391.getName(targetCode!)

                if (sourceCode === 'en') {
                    flagSource = `:flag_gb:`
                } else {
                    flagSource = `:flag_${sourceCode}:`
                }

                if (targetCode === 'en') {
                    flagTarget = `:flag_gb:`
                } else {
                    flagTarget = `:flag_${targetCode}:`
                }

                const newEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png'}) || '' })
                .setTitle('Translation')
                .setColor(0x518ff5)
                .addFields(
                    {
                        name: `${flagSource} ${sourceLanguage}`,
                        value: text!
                    },
                    {
                        name: `${flagTarget} ${targetLanguage}`,
                        value: res.text
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: interaction.guild!.name,
                    iconURL: interaction.guild!.iconURL({ extension: 'png'}) || ''
                })

                return interaction.editReply({ embeds: [newEmbed] })
            }
        }
    }
)

export default translate