import { model, Schema } from "mongoose";
import { CharacterModelInterface } from "../interfaces/character.interface.js";

const characterSchema = new Schema({
    _id: String,
    guild: String,
    name: String,
    age: Number,
    gender: String,
    nationality: String
})

export default model<CharacterModelInterface>('Character___Data_New', characterSchema);