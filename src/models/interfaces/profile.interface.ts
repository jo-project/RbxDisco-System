import { Document } from "mongoose";

export interface ProfileModelInterface extends Document {
    _id: string;
    user: string;
    name: string;
    custom_id: string;
} 