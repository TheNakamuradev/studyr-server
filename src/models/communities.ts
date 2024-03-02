import { Schema, Document, model } from 'mongoose';

interface Community extends Document {
    name: string;
    admin: string;
    description: string;
    users: string[];
}

const communitiesSchema = new Schema<Community>({
    name: {
        type: String,
        required: true   
    },
    admin: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        required: true
    }
});

export default model<Community>("Communities", communitiesSchema);
