import { Document } from "mongoose";

export interface GuildModelInterface extends Document {
    _id: string;
    prefix: string;
}