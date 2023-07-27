
import mongoose from 'mongoose';

const projectCardSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
    },
    project_id: {
        type: String
    },
    items:{
        type:[],
        default:[]
    }

},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }

);

const ProjectCard = mongoose.model('projectCards', projectCardSchema)

export default ProjectCard;