import { Document } from "mongoose";

export interface InviteModelInterface extends Document {
    _id: string;
    link: string;
}