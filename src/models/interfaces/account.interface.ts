import { Document } from "mongoose";

export interface AccountModelInterface extends Document {
    _id: string;
    username: string;
    password: string;
    is_login: boolean
} 