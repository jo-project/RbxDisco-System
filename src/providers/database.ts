import Mongoose, { Schema, Connection, Model, DefaultSchemaOptions } from 'mongoose';
import { resolve } from 'path';

import { Bot } from '../structures/bot.js';
import { default as GuildModel } from '../models/data/guild.js';
import { GuildModelInterface } from '../models/interfaces/guild.interface.js';
import { readFiles } from '../extensions/readFiles.js';
import { globalFilePath } from '../types/path.type.js';

export class DatabaseProvider {

    constructor(protected client: Bot) {}
        

    public connection: Connection | null = this.getConnection();
    public models: Map<string, Model<{[x: string]: any; }, {}, {}, {}, Schema<any, Model<any, any, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, { [x: string]: any;}>>> = new Map()

    async _initialize() : Promise<void> {
        try {
            await Mongoose.set('strictQuery', false)
            await Mongoose.connect(this.getConnectionUri())
            await this.registerModels()
            this.client.guildIds.map(async (id: string) => {
            const guildExists = await this.findGuildById(id);
    
            if (!guildExists) {
                const newGuild = new GuildModel({ _id: id });
                await newGuild.save();
            }
        });
        } catch (error) {
            console.error('Failed while fetching new guilds', error);
        }
    }

    /**
    * Find guild by id
    * @param id
    * @returns Guild Model
    */
    async findGuildById(id: string): Promise<GuildModelInterface | null> {
        const guild = await GuildModel.findById(id);
        return guild ?? null;
    }

    async registerModels() {
        const paths = await readFiles(`${process.cwd()}/dist/models/data`)
        await Promise.all(
            paths.map(async (path) => {
                const model = await import(globalFilePath(resolve(path))).then(x => x.default)
                this.models.set(model.modelName, model)
            })
        )
    }



    /**
     * Get database connection
     */
    private getConnection(): Connection | null {
        const connection = Mongoose.connection;
        this.connection = connection;
        return connection ?? null;
    }

    /**
    * Get connection URI
    */
    private getConnectionUri(): string {
        return process.env.MONGO_DB!
    }
}