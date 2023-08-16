import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
    {
    project_id:String,
    invited_user:String,
    status:{
        type:String,
        default:'Pending'
    }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Invitation = mongoose.model('Invitation', invitationSchema)

export default Invitation;