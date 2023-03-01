import { Collection, REST, Routes, ApplicationCommandOptionType } from "discord.js"
import { AsciiTable3 } from "ascii-table3";
import { resolve } from 'path';

import { Bot } from "../structures/bot.js";
import { CommandBuilder } from "discordbuilder.js"

import { readFiles } from "../extensions/readFiles.js";

import { globalFilePath } from "../types/path.type.js";
import { find } from "../extensions/find.js";

export class CommandService {
    readonly commands = new Collection<string, CommandBuilder>();
    readonly subcommands = new Collection<string, number>();
    public bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot
    }

    async _initialize() {
        const table = new AsciiTable3('System')
            .setHeading('Command', 'Status')
            .setAlignCenter(2)
            this.commands.clear();
            this.subcommands.clear();
            this.bot.help.clear();
            const paths = await readFiles(`${process.cwd()}/dist/commands`)
            await Promise.all(
                paths.map(async (path) => {
                    const command = await find(path).catch(() => {})
                    this.commands.set(command.name, command)
    
                    table.addRow(command.name, 'CONNECTED')
                })
            ).catch((e) => {
                console.log(e)
            })

            const rest = new REST({ version: '10' }).setToken(this.bot.token!);
            const commands = this.bot.commands;

            this.commands.forEach(command => {
                commands.push(command.toJSON())
                if (command.options !== undefined) {
                    const commandHasSubCommandGroup = command.options.filter(opt => {
                        const cmdOpt = opt.toJSON();
                        if (cmdOpt.type === ApplicationCommandOptionType.SubcommandGroup) {
                            return cmdOpt
                        }
                    })

                    const commandHasSubCommand = command.options.filter(opt => {
                        const cmdOpt = opt.toJSON();
                        if (cmdOpt.type === ApplicationCommandOptionType.Subcommand) {
                            return cmdOpt
                        }
                    })

                    command.options.filter(opt => {
                        const cmdOpt = opt.toJSON()
                        if (cmdOpt.type !== ApplicationCommandOptionType.Subcommand && cmdOpt.type !== ApplicationCommandOptionType.SubcommandGroup) {
                            this.bot.help.set(command.name, {
                                name: command.name,
                                level: command.level,
                                category: command.category,
                                description: command.description
                            })
                        }
                    })

                    commandHasSubCommand.forEach(sub => {
                        //@ts-ignore
                        this.bot.help.set(`${command.name} ${sub.name}`, {
                            //@ts-ignore
                            level: sub.level,
                             //@ts-ignore
                            name: `${command.name} ${sub.name}`,
                            category: command.category,
                             //@ts-ignore
                            description: `${sub.description}`
                        })
                        //@ts-ignore
                        this.subcommands.set(`${command.name}.${sub.name}`, sub.level)
                    })

                    commandHasSubCommandGroup.forEach(sub => {
                        const subJson = sub.toJSON();
                        //@ts-ignore
                        const dataOpt = sub.options
                        dataOpt.forEach((opt: any) => {
                            this.bot.help.set(`${command.name} ${subJson.name} ${opt.name}`, {
                                level: opt.level,
                                name: `${command.name} ${subJson.name} ${opt.name}`,
                                category: command.category,
                                description: `${opt.description}`
                            })
                            this.subcommands.set(`${command.name}.${subJson.name}.${opt.name}`, opt.level)
                        })
                    })
                }
            })
            
            this.bot.guildIds.forEach(async guildId => {
                await rest.put(
                    Routes.applicationGuildCommands(this.bot.user!.id, guildId),
                    { body: commands }
                ).catch((e) => {
                    console.log(e)
                });
            })


            return console.log(table.toString())
    }

    /**
    * Get command
    * @param cmd Command name
    * @returns Command
    */
    async getCommandByName(cmd: string) {
        const command = this.commands.get(cmd);
        return command;
    }
}