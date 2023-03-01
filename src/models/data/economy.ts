import { model, Schema } from "mongoose";
import { EconomyModelInterface } from "../interfaces/economy.interface.js";

const economySchema = new Schema({
    _id: String,
    guild: String,
    wallet: {
        type: Number,
        default: 0
    },
    bank: {
        type: Number,
        default: 0
    }
})

export default model<EconomyModelInterface>('Economy___Data_New', economySchema);