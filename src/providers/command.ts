
import { Bot } from '../structures/bot.js';
import { default as CommandModel } from '../models/data/command.js';
import { CommandModelInterface } from '../models/interfaces/command.interface.js';

export class CommandProvider {
    public commands: any[] = []
    public data: CommandModelInterface & Required<{ _id: string; }> | undefined;
    public guildId: string;
    constructor(protected client: Bot, guildId: string) {
        this.guildId = guildId;
    }
    
    async _initialize() {
        if (this.commands.length == 0) {
            const commands = this.client.commands.map(command => command.name);
            this.commands = commands
        }

        if (this.data === undefined) {
            this.data = await CommandModel.findById(this.guildId) || new CommandModel({
                _id: this.guildId
            })
            this.data.save()
        }

        return this;
    }

    getCommands() {
        return this.commands
    }

    getDataCommands() {
        if (this.data !== undefined) {
            return this.data.commands
        }
    }

    disableCommand(commandName : string) {
        if (this.commands.length > 0 && this.data !== undefined) {
            const commandIsDisabled = this.data.commands.includes(commandName)
            if (commandIsDisabled) {
                return {
                    status: 404,
                    response: {
                        error: `Command \`${commandName}\` is already disabled`
                    }
                }
            } else {
                this.data.commands.push(commandName)
                this.data.save();

                return {
                    status: 200,
                    response: {
                        success: `Command \`${commandName}\` is successfully disabled`
                    }
                }
            }
        }
    }

    enableCommand(commandName : string) {
        if (this.commands.length > 0 && this.data !== undefined) {
            const commandIsDisabled = this.data.commands.includes(commandName)
            if (!commandIsDisabled) {
                return {
                    status: 404,
                    response: {
                        error: `Command \`${commandName}\` is already enabled`
                    }
                }
            } else {
                let array = this.data.commands
                array = this.data.commands.filter(command => command !== commandName)
                this.data.commands = array
                this.data.save();

                return {
                    status: 200,
                    response: {
                        success: `Command \`${commandName}\` is successfully enabled`
                    }
                }
            }
        }
    }

    checkCommandDisable(commandName: string) {
        if (this.data !== undefined) {
            const commandIsDisabled = this.data.commands.includes(commandName)
            if (commandIsDisabled) {
                return `Command \`${commandName}\` is disabled`
            }
        }
    }
}