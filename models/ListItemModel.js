import mongoose from "mongoose";

const listItemSchema = new mongoose.Schema({
    project_id: {
        type: String
    },
    list_id: {
        type: String
    },
    name: {
        type: String,
        required: true,
    },
    assignee: {
        type: String,
        default: ''
    },
    due_date: {
        type: String,
        default: ''
    },
    projects: {
        type: [],
        default: []
    },
    priority: {
        type: String,
        default: ''
    },
    workStatus: {
        type: String,
    },
    status: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    comments: {
        type: [],
        default: []
    },
    tasks_date: {
        type: String,
        default: ''
    },
    sub_task: {
        type: [],
        default: []
    }
},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const ListItem = mongoose.model('ListItem', listItemSchema)

export default ListItem;