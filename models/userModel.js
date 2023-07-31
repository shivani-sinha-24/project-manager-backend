import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        required: true,
        type: String
    },
    email: {
        type: String,
        allowNull: false
    },
    // contact_no: {
    //     type: String,
    //     allowNull: false
    // },
    password: {
        type: String
    },
    // status: {
    //     type: String,
    //     default: "Active",
    // },
    // image: {
    //     type: String,
    // },
    // role: {
    //     type: String,
    // },
    // otp: {
    //     type: String
    // },
    // description:{
    //     type: String,
    // },
    // permissions:{
    //     type:Object
    // }
},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }

)

const User = mongoose.model('users', userSchema)

export default User;