import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";

import { AdminProvider } from "../../providers/admin.js";

import { allowedCommandChannel } from "../../types/channel.type.js";
import { CommandProvider } from "../../providers/command.js";
import { EmbedService } from "../../services/embed.js";

const interactionCreate = new EventBuilder(false)
.setName('interactionCreate')
.setCallback(
    async(client: Bot, interaction: ChatInputCommandInteraction) => {
        if (interaction.isCommand()) {
            const { channel, guild } = interaction;
            if (interaction.user.id !== `780493281552760862`) {
               if (channel!.id !== allowedCommandChannel) {
                    const targetChannel = guild!.channels.cache.get(allowedCommandChannel)
                    if (targetChannel) {
                        const errEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setColor(0xB12626)
                        .setDescription(`You can only use commands on <#${targetChannel.id}>`)
                        .setTimestamp()
                        .setFooter({
                            text: guild!.name,
                            iconURL: guild!.iconURL({ extension: 'png' }) || ''
                        })

                        return interaction.reply({ embeds: [errEmbed], ephemeral: true })
                    }
               }
            }

            const adminProvider = new AdminProvider(guild!.id)
            const commandProvider = new CommandProvider(client, guild!.id)
            const embedService = new EmbedService(guild!)
            await commandProvider._initialize();

            const isCommandDisabled = commandProvider.checkCommandDisable(interaction.commandName)
            if (isCommandDisabled) {
                await interaction.deferReply()
                const errEmbed = await embedService.commandError(isCommandDisabled)
                return interaction.editReply({ embeds: [errEmbed]})
            }

            await adminProvider._initialize()
            const commandService = await client.Commands
            if (commandService) {
                const command = commandService.commands.get(interaction.commandName)
                var level: number | undefined;
                var commandName: string = interaction.commandName
                var type: string = ''

                //@ts-ignore
                if (interaction.options._group !== null) {
                    const commandSubGroupOptions = interaction.options.getSubcommandGroup()
                    const subCommandOption = interaction.options.getSubcommand()
                    if (subCommandOption) {
                        const sub = `${command!.name}.${commandSubGroupOptions}.${subCommandOption}`
                        const subCommandLevel = commandService.subcommands.get(sub)
                        commandName = subCommandOption
                        level = subCommandLevel!;
                        type = 'subcommand'
                    }
                    //@ts-ignore
                } else if (interaction.options._group === null && interaction.options._subcommand !== null) {
                    const commandSubCommandOptions = interaction.options.getSubcommand()
                    const sub = `${command!.name}.${commandSubCommandOptions}`
                    const subCommandLevel = commandService.subcommands.get(sub)
                    commandName = commandSubCommandOptions
                    level = subCommandLevel!;
                    type = 'subcommand'
                } else {
                    commandName = command!.name
                    level = command!.level
                    type = 'command'
                }

                if (command) {
                    if (level) {
                        const checkLevel = await adminProvider.check(interaction.user.id, level)
                        if (checkLevel) {
                            if (checkLevel.status === 404) {
                                await interaction.deferReply()
                                const errEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.avatarURL({ extension: 'png'}) || `https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3`
                                })
                                .setTitle('Warning - Insufficient Permission')
                                .setColor(0xB12626)
                                .setDescription(`The \`${commandName}\` option of this command is limited to the admin level **${level}**!`)
                                .setTimestamp()
                                .setFooter({ text: interaction.guild!.name,  iconURL: interaction.guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                                return interaction.editReply({ embeds: [errEmbed]})
                            }

                            if (command.callback !== undefined) await command.callback(client, interaction)
                        }
                    } else {
                        if (command.callback !== undefined) await command.callback(client, interaction)
                    }
                }
            }
        }
    }
)

export default interactionCreate