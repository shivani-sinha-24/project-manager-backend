
import mongoose from 'mongoose';

const projectCardListSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    project_id: {
        type: String
    },
    card_id: {
        type: String
    },
    priority: {
        type: String
    }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const ProjectCardList = mongoose.model('projectCardLists', projectCardListSchema)

export default ProjectCardList;