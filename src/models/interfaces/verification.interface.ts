import { Document } from "mongoose";

export interface VerificationModelInterface extends Document {
    _id: string;
    role: string,
    channel: string
}