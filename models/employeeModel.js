import mongoose from 'mongoose';

const empSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    fatherName: {
        type: String
    },
    designation: {
        type: String
    },
    image: {
        type: String
    },
    mobileNo: {
        type: String
    },
    documentsUploads: {
        type: Array
    },
    dateofJoining: {
        type: String
    },
    birthday: {
        type: String
    },
    maritalStatus:{
        type: String
    },
    anniversaryDate:{
        type: String
    },
    salary:{
        type: String
    }
},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }

)

const Emp = mongoose.model('emps', empSchema)

export default Emp;