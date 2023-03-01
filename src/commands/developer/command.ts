import { ChatInputCommandInteraction } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import { EmbedService } from "../../services/embed.js";
import { CommandProvider } from "../../providers/command.js";

const command = new CommandBuilder()
.setName('command')
.setDescription('Enable / disable a registered slash command')
.setClass('Developer')
.setLevel(6)
.setCategory({
    name: 'Developer',
    emoji: '<:dev:1071162053319991398>'
})
.addSubcommand(opt => opt
    .setName('enable')
    .setDescription('Enable a register slash command')
    .setLevel(6)
    .addStringOption(opt => opt
        .setName('command_name')
        .setDescription('The name of the slash command')
        .setRequired(true)
    )
)
.addSubcommand(opt => opt
    .setName('disable')
    .setDescription('Disable a register slash command')
    .setLevel(6)
    .addStringOption(opt => opt
        .setName('command_name')
        .setDescription('The name of the slash command')
        .setRequired(true)
    )
)
.addSubcommand(opt => opt
    .setName('check')
    .setDescription('Check all disabled register slash commands')
    .setLevel(6)
)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, guild } = interaction;
        const embedService = new EmbedService(guild!)
        const commandSystem = new CommandProvider(client, guild!.id)
        await commandSystem._initialize()

        const allCommands = await commandSystem.getCommands()
        if (options.getSubcommand() === 'enable') {
            await interaction.deferReply()
            const commandName = options.getString('command_name')
            if (commandName) {
                const name = allCommands.find(command => command === commandName.toLowerCase());
                if (name) {
                    const enableCommand = commandSystem.enableCommand(name)
                    if (enableCommand) {
                        if (enableCommand.status === 404) {
                            const errResponse = enableCommand.response.error
                            const errEmbed = await embedService.commandError(errResponse!)

                            return interaction.editReply({ embeds: [errEmbed] })
                        } else if (enableCommand.status === 200) {
                            const succResponse = enableCommand.response.success
                            const succEmbed = await embedService.commandSucces(succResponse!)

                            return interaction.editReply({ embeds: [succEmbed] })
                        }
                    }
                }
            }
        } else if (options.getSubcommand() === 'disable') {
            await interaction.deferReply()
            const commandName = options.getString('command_name')
            if (commandName) {
                const name = allCommands.find(command => command === commandName.toLowerCase());
                if (name) {
                    const disableCommand = commandSystem.disableCommand(name)
                    if (disableCommand) {
                        if (disableCommand.status === 404) {
                            const errResponse = disableCommand.response.error
                            const errEmbed = await embedService.commandError(errResponse!)

                            return interaction.editReply({ embeds: [errEmbed] })
                        } else if (disableCommand.status === 200) {
                            const succResponse = disableCommand.response.success
                            const succEmbed = await embedService.commandSucces(succResponse!)

                            return interaction.editReply({ embeds: [succEmbed] })
                        }
                    }
                }
            }
        } else if (options.getSubcommand() === 'check') {
            const allCommands = commandSystem.getCommands()
            const allDataCommands = commandSystem.getDataCommands()

            if (allCommands && allDataCommands) {
                console.log('===== Commands =====')
                console.log(allCommands)
                console.log('\n\n\n')
                console.log('===== Disabled Commands =====')
                console.log(allDataCommands)
            }
        }
    }
)

export default command