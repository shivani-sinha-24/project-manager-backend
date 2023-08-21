import mongoose from 'mongoose';

const empSchema = new mongoose.Schema({
    name: {
        type: String
    },
    fatherName: {
        type: String
    },
    email: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    designation: {
        type: String
    },
    localAddress: {
        type: String
    },
    permanentAddress: {
        type: String
    },
    department: {
        type: String
    },
    empId: {
        type: String
    },
    gender: {
        type: String
    },
    image: {
        type: String
    },
    mobile: {
        type: String
    },
    panCard: {
        type: String
    },
    adharf: {
        type: String
    },
    adharb: {
        type: String
    },
    expCer: {
        type: String
    },
    payslip1: {
        type: String
    },
    payslip2: {
        type: String
    },
    payslip3: {
        type: String
    },
    dateofJoining: {
        type: String
    },
    birthday: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    anniversaryDate: {
        type: String
    },
    experience: {
        type: String
    },
    salary: {
        type: String
    },
    bankName: {
        type: String
    },
    bankAccountNo: {
        type: String
    },
    bankBranchName: {
        type: String
    },
    bankifsc: {
        type: String
    }
},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }

)

const Emp = mongoose.model('emps', empSchema)

export default Emp;