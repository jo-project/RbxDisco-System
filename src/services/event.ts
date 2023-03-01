import { Collection } from "discord.js";
import { AsciiTable3 } from 'ascii-table3'
import { Bot } from "../structures/bot.js";
import { globalFilePath } from "../types/path.type.js";
import { resolve } from 'path'
import { readFiles } from "../extensions/readFiles.js";
import { find } from "../extensions/find.js";

export class EventService {
    readonly events = new Collection()
    public bot: Bot;
    constructor(bot : Bot){
        this.bot = bot;
    }

    async _initialize() {
        try {
            const table = new AsciiTable3('System')
            .setHeading('Event', 'Status')
            .setAlignCenter(2)
            this.events.clear();
            const paths = await readFiles(`${process.cwd()}/dist/events`)
            await Promise.all(
                paths.map(async (path) => {
                    const event = await find(path).catch(() => {})
                    const callback = (...args: any) => void event.callback(this.bot, ...args)
                    this.events.set(event.name, callback);

                    if (event.once) this.bot.once(event.name, callback);
                    else this.bot.on(event.name, callback)

                    table.addRow(event.name, 'CONNECTED')
                })
            )

            return console.log(table.toString())
        } catch(err) {
            console.error(err)
        }
    }
}