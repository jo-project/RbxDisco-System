import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ButtonInteraction } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

const commands = new CommandBuilder()
.setName('commands')
.setDescription('Display a list of all the available commands')
.setClass('Member')
.setLevel(0)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.setCallback(
    async ( client: Bot, interaction: ChatInputCommandInteraction) => {
        const help = client.help

        const directories = [
            ...new Set(help.map((cmd) => cmd.category.name))
        ]

        const emoji_1 = new Map<string, string>();
        help.forEach(cmd => {
            const categoryName: string = cmd.category.name.valueOf()
            const categoryEmoji: string = cmd.category.emoji.valueOf()
            if (!emoji_1.get(categoryName)) {
                emoji_1.set(categoryName, categoryEmoji)
            }
        })

        const formatString = (str: any) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

        const categories = directories.map((dir) => {
            const getCommands = help.filter((cmd) => cmd.category.name === dir).map((cmd) => {
                return {
                    name: cmd.name,
                    description: cmd.description || 'No description',
                    level: cmd.level
                }
            });

            return {
                directory: formatString(dir.valueOf()),
                emoji: emoji_1.get(dir.valueOf()),
                commands: getCommands
            }
        })

        await interaction.deferReply()

        const commandEmbed = new EmbedBuilder()
        .setDescription('Please choose a category in the dropdown menu')

        const components = (state: boolean, placeholder: string) => [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('command-menu')
                .setPlaceholder(placeholder)
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: `${cmd.directory}`,
                            value: cmd.directory.toLowerCase(),
                            description: `Commands from ${cmd.directory}`,
                            emoji: `${cmd.emoji}`
                        }
                    })
                )
            ),
        ];

        const createComponent = components(false, 'Please select a category')

        const initialMessage = await interaction.editReply({
            embeds: [commandEmbed],
            components: createComponent
        })

        //@ts-ignore
        const collector = interaction.channel!.createMessageComponentCollector({ time: 60000 })

        collector.on('collect', (i: StringSelectMenuInteraction | ButtonInteraction) => {
            if (i.user.id === interaction.user.id) {
                if (i.isStringSelectMenu()) {
                    const [directory] = i.values
                    const category = categories.find((x) => x.directory.toLowerCase() === directory);
                    const categoryEmbed = new EmbedBuilder()
                    .setTitle(`${category!.emoji} ${formatString(directory)}`)
                    .setDescription(`List of commands under ${formatString(directory)}`)
                    .addFields(
                        category!.commands.map((cmd) => {
                            return {
                                name: `\`${cmd.name}\``,
                                value: `${cmd.description}
                                Access level ${cmd.level}`,
                                inline: true
                            }
                        })
                    );
        
                    i.update({ embeds: [categoryEmbed], components: components(false, `${category!.directory}`)});
                }
            }
        })

        collector.on('end', () => {
            initialMessage.edit({ components: components(true, 'Disabled')})
        })
    }
)

export default commands