import { Document } from "mongoose";

export interface CharacterModelInterface extends Document {
    _id: string;
    guild: string
    name: string;
    age: number;
    gender: string;
    nationality: string
} 