import { model, Schema } from 'mongoose';
import { GuildModelInterface } from '../interfaces/guild.interface.js';

const GuildSchema: Schema = new Schema({
   _id: String,
    prefix: {
        type: String,
        default: ';'
    }
})

export default model<GuildModelInterface>('Guild___Data_New', GuildSchema);