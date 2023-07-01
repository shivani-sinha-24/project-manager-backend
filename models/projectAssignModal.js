
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String
    },
    UsersList: {
        type: Array,
    },

},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }

);

const Project = mongoose.model('projects', projectSchema)

export default Project;