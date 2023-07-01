
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
    },
    privacy: {
        type: String,
    },
    workType: {
        type: Array,
    },
    user_id: {
        type: String
    }

},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }

);

const Project = mongoose.model('projects', projectSchema)

export default Project;