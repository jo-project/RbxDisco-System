import { model, Schema } from "mongoose";
import { ProfileModelInterface } from "../interfaces/profile.interface.js";

const profileSchema = new Schema({
    _id: String,
    user: String,
    custom_id: String,
    name: String,
})

export default model<ProfileModelInterface>('Profile___Data_New', profileSchema);