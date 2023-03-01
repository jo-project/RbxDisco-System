import { Document } from "mongoose";

export interface CommandModelInterface extends Document {
    _id: string;
    commands: string[]
}