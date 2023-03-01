import { Document } from "mongoose";

export interface AdminModelInterface extends Document {
    _id: string,
    level_2: Array<{
        type: string,
        id: string
    }>
    level_3: Array<{
        type: string,
        id: string
    }>;
    level_4: Array<{
        type: string,
        id: string
    }>;
    level_5: Array<{
        type: string,
        id: string
    }>;
    level_6: Array<{
        type: string,
        id: string
    }>;
}