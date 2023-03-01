import { model, Schema } from 'mongoose';
import { InviteModelInterface } from '../interfaces/invite.interface.js';

const InviteSchema: Schema = new Schema({
    _id: String,
    link: String
})

export default model<InviteModelInterface>('Invite__Data_New', InviteSchema);