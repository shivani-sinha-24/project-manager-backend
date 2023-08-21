import User from "../models/userModel.js";
import Emp from "../models/employeeModel.js";
import Validator from "validatorjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import reply from '../common/reply.js';
import crypto from 'crypto';
import Mail from "../common/Mail.js";
import moment from "moment";
import bodyParser from "body-parser";
import Token from "../models/tokenModel.js";
import Invitation from "../models/Invitation.js";

function createPassword() {

    var length = 8;
    var password = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charLength = characters.length;
    for (var i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return password;
}


function makeid() {
    return crypto.randomBytes(20).toString('hex');
}


export default {


    // emp registration:
    async addEmp(req, res) {
        let request = req.body;
        let image = req.files && req?.files['image'] ? req?.files['image'][0] : null;
        let panCard = req.files && req?.files['panCard'] ? req?.files['panCard'][0] : null;
        let adharf = req.files && req?.files['adharf'] ? req?.files['adharf'][0] : null;
        let adharb = req.files && req?.files['adharb'] ? req?.files['adharb'][0] : null;
        let expCer = req.files && req?.files['expCer'] ? req?.files['expCer'][0] : null;
        let payslip1 = req.files && req?.files['payslip1'] ? req?.files['payslip1'][0] : null;
        let payslip2 = req.files && req?.files['payslip2'] ? req?.files['payslip2'][0] : null;
        let payslip3 = req.files && req?.files['payslip3'] ? req?.files['payslip3'][0] : null;
        request.image = req?.file == undefined ? null : req?.file?.filename != undefined && req?.file?.filename;
        const exist = await Emp.findOne({ "empId": request.empId }).sort('-created_at')
        if (exist) {
            return res.json(reply.failed('This name is already exists!'));
        }
        if (image && panCard && adharf && adharb && expCer && payslip1 && payslip2 && payslip3) {
            request.image = req?.files['image'][0]?.filename;
            request.panCard = req?.files['panCard'][0]?.filename;
            request.adharf = req?.files['adharf'][0]?.filename;
            request.adharb = req?.files['adharb'][0]?.filename;
            request.expCer = req?.files['expCer'][0]?.filename;
            request.payslip1 = req?.files['payslip1'][0]?.filename;
            request.payslip2 = req?.files['payslip2'][0]?.filename;
            request.payslip3 = req?.files['payslip3'][0]?.filename;
        } else if (image && !panCard && !adharf && !adharb) {
            request.image = req?.files['image'][0]?.filename;
        } else if (image && panCard && !adharf && !adharb) {
            request.image = req?.files['image'][0]?.filename;
            request.panCard = req?.files['panCard'][0]?.filename;
        } else if (image && panCard && !adharf && !adharb) {
            request.image = req?.files['image'][0]?.filename;
            request.panCard = req?.files['panCard'][0]?.filename;
        } else if (image && !panCard && !adharf && !adharb) {
            request.image = req?.files['image'][0]?.filename;
        } else if (panCard && !image && !adharf && !adharb) {
            request.panCard = req?.files['panCard'][0]?.filename;
        } else if (!panCard && !image && adharf && !adharb) {
            request.adharf = req?.files['adharf'][0]?.filename;
        } else if (!panCard && !image && !adharf && adharb) {
            request.adharb = req?.files['adharb'][0]?.filename;
        }
        try {
            if (!exist) {
                const emp = await Emp.create(request);
                return res.json(reply.success("Emp Created Successfully!!", { emp }));
            }
        } catch (err) {
            console.log("err", err)
            return res.json(reply.failed("Something Went Wrong!"))
        }
    },

    // get Emplist
    async getEmp(req, res) {
        try {
            let empItem = await Emp.find();
            return res.status(200).json(empItem);
        } catch (err) {
            return res.status(400).send({ message: "Unable to fetch emp datails!" })
        }
    },

    // get Emp by Id
    async getEmpById(req, res) {
        try {
            let emp = await Emp.find({ _id: req.body.id });
            return res.status(200).json(emp);
        } catch (err) {
            return res.status(400).send({ message: "Unable to fetch emp datails!" })
        }
    },

    // Delete Emp:
    async deleteEmp(req, res) {
        try {
            let id = req.query.id
            const emp = await Emp.findByIdAndRemove(id)
            if (!emp) {
                return res.status(404).send({ message: "Employee not found" })
            }
            return res.status(200).send({ status_code: 200, id: id, message: "Employee deleted successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    },


    // Update Employee
    async updateEmp(req, res) {
        try {
            let request = req.body;
            if (!request) {
                return res.status(400).send({ message: "All Input Field Is Required" });
            }
            let _id = req.body.id;
            const emp = await Emp.findById(_id);
            if (!emp) {
                return res.status(404).send({ message: "Employee Not Found !!" })
            }
            let image = req.files && req?.files['image'] ? req?.files['image'][0] : null;
            request.image = req?.files['image'][0]?.filename;
            await Emp.findByIdAndUpdate(_id, request, { new: true })
            return res.status(200).send({ status_code: 200, emp: request, message: "Emp updated successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    }


}


