import { model, Schema } from 'mongoose';
import { CommandModelInterface } from '../interfaces/command.interface.js';

const CommandSchema: Schema = new Schema({
    _id: String,
    commands: Array<String>
})

export default model<CommandModelInterface>('Command__Data_New', CommandSchema);