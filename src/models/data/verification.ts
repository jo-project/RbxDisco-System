import { model, Schema } from 'mongoose';
import { VerificationModelInterface } from '../interfaces/verification.interface.js';

const VerificationSchema: Schema = new Schema({
    _id: String,
    role: String,
    channel: String
})

export default model<VerificationModelInterface>('Verification__Data_New', VerificationSchema);