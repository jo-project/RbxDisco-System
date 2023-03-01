import { Document } from "mongoose";

export interface EconomyModelInterface extends Document {
    _id: string;
    guild: string;
    wallet: string;
    bank: string
}