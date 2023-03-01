import { model, Schema } from 'mongoose';
import { AdminModelInterface } from '../interfaces/admin.interface.js';

const AdminSchema: Schema = new Schema({
    _id: String,
    level_2: {
        type: Array<{
            type: String,
            id: String
        }>,
        default: []
    },
    level_3: {
        type: Array<{
            type: String,
            id: String
        }>,
        default: []
    },
    level_4: {
        type: Array<{
            type: String,
            id: String
        }>,
        default: []
    },
    level_5: {
        type: Array<{
            type: String,
            id: String
        }>,
        default: []
    },
    level_6: {
        type: Array<{
            type: String,
            id: String
        }>,
        default: []
    }
})

export default model<AdminModelInterface>('Admin__Data_New', AdminSchema);