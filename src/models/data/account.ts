import { model, Schema } from "mongoose";
import { AccountModelInterface } from "../interfaces/account.interface.js";

const accountSchema = new Schema({
    _id: String,
    username: String,
    password: String,
    is_login: {
        type: Boolean,
        default: false
    }
})

export default model<AccountModelInterface>('Account___Data_New', accountSchema);