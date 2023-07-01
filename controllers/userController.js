import User from "../models/userModel.js";
import Validator from "validatorjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import reply from '../common/reply.js';
import crypto from 'crypto';
import Mail from "../common/Mail.js";
import moment from "moment";
import bodyParser from "body-parser";

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


    // user registration:
    async userRegister(req, res) {

        let request = req.body;
        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"));
        }

        request.image = req?.file == undefined ? null : req?.file?.filename != undefined && req?.file?.filename;

        let validation = new Validator(request, {
            name: 'required|string',
            email: 'required|email',
            contact_no: 'required',
            password: 'required_if:role,0|min:8|same:confirm_password',
        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }
        const exist = await User.findOne({ "email": request.email }).sort('-created_at')
        if (exist && exist.is_deleted == false) {
            return res.json(reply.failed('This email is already exists!'));
        }
        try {

            if (request.role != 0) {
                let user_email = request.email
                // let random_password = createPassword()
                let hash_password = bcrypt.hashSync(user_email);
                // Mail.send(user_email, "" + `This is your password "${random_password}"`);

                if ((exist && exist.is_deleted == true) || !exist) {
                    request.password = hash_password
                    let updated = await User.create(request);
                    return res.json(reply.success("User Created Successfully!!", updated));
                }
            }
            request.password = bcrypt.hashSync(request.password);
            const user = await User.create(request)
            return res.json(reply.success("User Created Successfully!!", user));

        } catch (err) {
            console.log("err", err)
            return res.json(reply.failed("Something Went Wrong!"))
        }
    },

    // user login:
    async userLogin(req, res) {
        let request = req.body;
        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"))
        }

        let validation = new Validator(request, {
            email: 'required|email',
            password: 'required',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }

        try {
            const user = await User.findOne({ email: request.email.toString().toLowerCase() }).sort('-created_at');

            if (!user) {
                return res.json(reply.failed("The selected email is invalid"))
            }

            if ((!user || user.is_deleted == true)) {
                return res.json(reply.failed('User does not exist!'));
            }
            if (user.tab_status == "Inactive") {
                return res.json(reply.failed("Sorry! Your Acount is deactivated"));
            }
            const passwordIsvalid = bcrypt.compareSync(request.password, user.password);

            if (!passwordIsvalid) {
                return res.json(reply.failed("Password Incorrect!"));
            }

            var token_id = makeid();

            let token = jwt.sign({ "user_id": user._id, "tid": token_id }, process.env.SECRET_KEY, { expiresIn: "24h" });

            await Token.create({ token_id, user_id: user._id });
            const { password, ...responseUser } = user._doc
            return res.json(reply.success("Login Successfully!!", { responseUser, token: token }))

        } catch (err) {
            console.log("err", err)
            return res.json(reply.failed("Something Went Wrong!"))
        }

    },

    // Send Mail OTP
    async sendMail(req, res) {
        let data = req.body;
        //console.log(data);
        let validation = new Validator(data, {
            email: 'required|email',
        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }

        let user = await User.findOne({ email: data.email });
        if (!user) {
            return res.json(reply.failed(" Email not found!! "))
        }

        let otp = Math.floor((100000 + Math.random() * 900000));
        // timestamp // 
        let today = new Date();
        var timeStamp = (moment(today).unix()) * 1000 + (5 * 60000);

        var email = data.email;

        data = {
            otp: otp,
            expired_at: timeStamp
        }
        let current_time = (moment(today).unix()) * 1000;

        if (current_time < user.expired_at) {
            return res.json(reply.failed("Your previous otp is not expired yet"))
        }

        await User.updateOne({ email }, data);
        Mail.send(email, "" + `Your OTP For Verifying: "${data.otp}", This is valid for 5 minutes only.`);

        return res.json(reply.success("Mail has sent on your mail id", { email, expired_at: data.expired_at }))

    },

    // Resend OTP
    async resendOtp(req, res, next) {
        let request = req.body;
        //console.log(request);
        let validation = new Validator(request, {
            email: 'required|email',
        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }

        let user = await User.findOne({ email: request.email });
        if (!user) {
            return res.json(reply.failed(" Email not found!! "))
        }

        let otp = Math.floor((100000 + Math.random() * 900000));
        let today = new Date();
        var timeStamp = (moment(today).unix()) * 1000 + (5 * 60000);
        // var time = moment(timeStamp).format("hh:mm:ss");
        var email = request.email;
        let data = {
            otp: otp,
            expired_at: timeStamp
        }
        let current_time = (moment(today).unix()) * 1000;

        if (current_time < user.expired_at) {
            return res.json(reply.failed("Your previous otp is not expired yet"))
        }

        await User.updateOne({ email }, data);
        Mail.send(email, "" + data.otp);
        return res.json(reply.success("Mail has sent on your mail id", { expired_at: data.expired_at }))

    },

    // Forget Password 
    async forgetPassword(req, res) {
        let request = req.body;
        let validation = new Validator(request, {
            otp: 'required',
            email: 'required|email',
            new_password: 'required|same:confirm_password|min:8',
        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }

        try {

            let user = await User.findOne({ otp: request.otp });

            if (!user) {
                return res.json(reply.failed("This otp is invalid"));
            }

            let email = await User.findOne({ email: request.email });
            if (!email) {
                return res.json(reply.failed("User Not Found"))
            }

            let new_password = bcrypt.hashSync(request.new_password);
            let reset_password = await User.findByIdAndUpdate({ _id: user._id }, { password: new_password });

            if (reset_password) {
                var otp = await User.findByIdAndUpdate({ _id: user._id }, { otp: null, expired_at: null })
            }

            if (otp) {
                await Token.deleteMany({ user_id: user._id })
                return res.json(reply.success("Password Updated Successfully"));
            } else {
                return res.json(reply.failed("Unable to update"));
            }
        } catch (err) {
            return res.json(reply.failed("some error occured", err))
        }

    },

    // Change Password
    async changePassword(req, res) {
        let request = req.body;

        let validation = new Validator(request, {
            old_password: 'required',
            new_password: 'required|same:confirm_password|min:8',
        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }

        try {

            let user = await User.findById(request.userId);

            // IF USER NOT FOUND
            if (!user) {
                return res.json(reply.failed("Invalid Data!!"));
            }

            const password = bcrypt.compareSync(request.old_password, user.password);

            //IF PASSWORD INCORRECT
            if (!password) {
                return res.json(reply.failed("Old Password is Incorrect"));
            }

            user.password = bcrypt.hashSync(request.new_password);

            let updated = user.save();

            if (updated) {
                await Token.deleteMany({ user_id: request._id })
                return res.json(reply.success("Password Updated Successfully"));
            }

        } catch (err) {
            return res.json(reply.failed("failed to change password"));
            //console.log(err);
        }
    },

    // User Logout
    async logout(req, res) {
        try {
            let _id = req.user._id
            await Token.deleteMany({ user_id: _id })
            return res.json(reply.success("User Logged Out Successfully!!"))

        } catch (err) {
            console.log(err, "error");
            return res.json(reply.failed("Unable to logout!"))
        }
    },

    // Get Editor
    async getEditor(req, res) {
        try {
            let request = req.query;
            let Condition = {};

            if (request.name) {
                Condition.name = request.name
            }

            let page = parseInt(request.page);
            let limit = parseInt(request.limit)
            let total = await User.find({
                $and: [{
                    role: "editor"
                },
                    Condition

                ]
            }).count()

            let pages = Math.ceil(total / limit);

            let previousPage = (page <= 1) ? null : (page - 1);
            let nextPage = (page >= pages) ? null : (page + 1);

            let users = await User.find({
                $and: [{
                    role: "editor"
                },
                    Condition

                ]
            }).select("-password").skip((page - 1) * limit).limit(limit)

            return res.json(reply.success("Editors details fetched successfully", { total: total, users, page: page, per_page: limit, previousPage: previousPage, nextPage: nextPage }))


        } catch (err) {
            console.log(err, "error");
            return res.json(reply.failed("Unable to fetch editors datails!"))
        }
    },

    // Get Admin
    async getAdmin(req, res) {
        try {
            let request = req.query
            let Condition = {};

            if (request.name) {
                Condition.name = request.name
            }

            let page = parseInt(request.page);
            let limit = parseInt(request.limit)
            let total = await User.find({
                $and: [{
                    role: "admin"
                },
                    Condition

                ]
            }).count()

            let pages = Math.ceil(total / limit);

            let previousPage = (page <= 1) ? null : (page - 1);
            let nextPage = (page >= pages) ? null : (page + 1);

            let users = await User.find({
                $and: [{
                    role: "admin"
                },
                    Condition

                ]
            }).select("-password").skip((page - 1) * limit).limit(limit)

            return res.json(reply.success("Admins details fetched successfully", { total: total, users, page: page, per_page: limit, previousPage: previousPage, nextPage: nextPage }))


        } catch (err) {
            console.log(err, "error");
            return res.json(reply.failed("Unable to fetch admins datails!"))
        }
    },

    // Get Caller
    async getCaller(req, res) {
        try {
            let request = req.query
            let Condition = {};

            if (request.name) {
                Condition.name = request.name
            }

            let page = parseInt(request.page);
            let limit = parseInt(request.limit)
            let total = await User.find({
                $and: [{
                    role: "caller"
                },
                    Condition

                ]
            }).count()

            let pages = Math.ceil(total / limit);

            let previousPage = (page <= 1) ? null : (page - 1);
            let nextPage = (page >= pages) ? null : (page + 1);

            let users = await User.find({
                $and: [{
                    role: "caller"
                },
                    Condition

                ]
            }).select("-password").skip((page - 1) * limit).limit(limit)

            return res.json(reply.success("Callers details fetched successfully", { total: total, users, page: page, per_page: limit, previousPage: previousPage, nextPage: nextPage }))

        } catch (err) {
            console.log(err, "error");
            return res.json(reply.failed("Unable to fetch callers datails!"))
        }
    },

    // Get Cyberpartner
    async getCyberpartner(req, res) {
        try {
            let request = req.query
            let Condition = {};

            if (request.name) {
                Condition.name = request.name
            }

            let page = parseInt(request.page);
            let limit = parseInt(request.limit)
            let total = await User.find({
                $and: [{
                    role: "cyberpartner"
                },
                    Condition

                ]
            }).count()

            let pages = Math.ceil(total / limit);

            let previousPage = (page <= 1) ? null : (page - 1);
            let nextPage = (page >= pages) ? null : (page + 1);

            let users = await User.find({
                $and: [{
                    role: "cyberpartner"
                },
                    Condition

                ]
            }).select("-password").skip((page - 1) * limit).limit(limit)

            return res.json(reply.success("Cyberpartner details fetched successfully", { total: total, users, page: page, per_page: limit, previousPage: previousPage, nextPage: nextPage }))

        } catch (err) {
            console.log(err, "error");
            return res.json(reply.failed("Unable to fetch cyberpartners datails!"))
        }
    },

    async getUserById(req, res) {
        let user = await User.findById(req.user._id);
        return res.status(200).send({ user })

    },

    // Get Subadmin
    async getSuperadmin(req, res) {
        try {
            let request = req.query
            let Condition = {};

            if (request.name) {
                Condition.name = request.name
            }

            let page = parseInt(request.page);
            let limit = parseInt(request.limit)
            let total = await User.find({
                $and: [{
                    role: "superadmin"
                },
                    Condition

                ]
            }).count()

            let pages = Math.ceil(total / limit);

            let previousPage = (page <= 1) ? null : (page - 1);
            let nextPage = (page >= pages) ? null : (page + 1);

            let users = await User.find({
                $and: [{
                    role: "superadmin"
                },
                    Condition

                ]
            }).select("-password").skip((page - 1) * limit).limit(limit)

            return res.json(reply.success("Superadmins details fetched successfully", { total: total, users, page: page, per_page: limit, previousPage: previousPage, nextPage: nextPage }))

        } catch (err) {
            console.log(err, "error");
            return res.json(reply.failed("Unable to fetch superadmin datails!"))
        }
    },

    // Update User
    async updateUsers(req, res) {
        try {
            let request = req.body
            request.image = req?.file == undefined ? null : req?.file?.filename != undefined && req?.file?.filename;
            const image = req?.file?.filename;
            if (!request) {
                return res.json(reply.failed("All input is required"));
            }
            if (req.body.type == "user") {
                const user = await User.findById({ _id: req.body.id ? req.body.id : req.body._id });
                if (!user) {
                    return res.json(reply.failed("User not found!!"))
                }
                if (image) {
                    const users = await User.findOneAndUpdate(
                        { _id: req.body.id ? req.body.id : req.body._id },
                        {
                            $set: {
                                image: image,
                                name: req.body.name,
                                email: req.body.email,
                                contact_no: req.body.contact_no,
                                tab_status: req.body.tab_status,
                            },
                        },
                        { new: true }
                    );
                    if (users) {
                        // console.log("users:",users);
                        return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                    }
                } else {
                    const users = await User.findOneAndUpdate(
                        { _id: req.body.id ? req.body.id : req.body._id },
                        {
                            $set: {
                                name: req.body.name,
                                email: req.body.email,
                                contact_no: req.body.contact_no,
                                tab_status: req.body.tab_status,
                            },
                        },
                        { new: true }
                    );
                    if (users) {
                        console.log("users: ", users);
                        return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                    }
                }


            } else if (req.body.type == "property") {
                const user = await College.findById({
                    _id: req.query._id
                });
                if (!user) {
                    return res.json(reply.failed("User not found!!"))
                }
                await College.findByIdAndUpdate(req.query._id, request)
            }
            return res.status(200).send({ status_code: 200, users: request, message: "Users updated successfully." });

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    // Update UserProfile
    async updateUsersProfile(req, res) {
        try {
            let request = req.body
            const { name, description, id } = req.body
            let file = req?.file?.filename

            if (!request) {
                return res.json(reply.failed("All input is required"));
            }
            // console.log(name,description,file);
            const user = await User.findById({ _id: req.user.id });
            if (!user) {
                return res.json(reply.failed("User not found!!"))
            }
            if (name && description && file) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            image: req.file.filename,
                            name: req.body.name,
                            description: req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            } else if (name && !file && !description) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            // image: req.file.filename,
                            name: req.body.name,
                            // description:req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            } else if (file && !name && !description) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            image: req.file.filename,
                            // name:req.body.name,
                            // description:req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            } else if (description && !name && !file) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            // image: req.file.filename,
                            // name:req.body.name,
                            description: req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            } else if (name && file && !description) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            image: req.file.filename,
                            name: req.body.name,
                            // description:req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            } else if (name && !file && description) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            // image: req.file.filename,
                            name: req.body.name,
                            description: req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            } else if (!name && file && description) {
                const users = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $set: {
                            image: req.file.filename,
                            // name:req.body.name,
                            description: req.body.description
                        },
                    },
                    { new: true }
                );

                if (users) {

                    return res.status(200).send({ status_code: 200, "users": users, message: "User updated successfully." });
                }
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    },



    // Delete User:
    async deleteUsers(req, res) {
        try {
            let id = req.query.id
            const user = await User.findByIdAndRemove(id)
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }
            return res.status(200).send({ message: "User deleted successfully" })
        } catch (err) {
            return res.status(400).send(err)
        }
    },

    // Get All User By Role
    async getAllRoleUsers(req, res) {
        // let request = req.body;
        try {
            // let Condition = {};
            // if (request.name) {
            // }
            // if (request.role) {
            //     Condition.role = request.role
            // }
            // let page = parseInt(request.page);
            // let limit = parseInt(request.limit);
            // const page = request.page ? parseInt(request.page) : 1;
            // const limit = request.limit ? parseInt(request.limit) : 5;
            let total = await User.find({ role: req?.body?.role }).count();
            let users = await User.find({ role: req?.body?.role }).select("-password");
            // let tab_status = await Status.find({ status_for: "0" });
            return res.status(200).send({ total: total, users })

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    // async getUsersByRole(req,res){
    //     console.log("tets")
    //     console.log(req,"req");
    // },


    // Reset Password
    async resetPassword(req, res) {
        try {
            let user = req.user
            if (!user) {
                return res.status(400).send({ message: "Invalid data" })
            }
            let user_email = user.email
            //    let new_password = createPassword()
            //    user.password = bcrypt.hashSync(new_password);
            Mail.send(user_email, "" + `This is your link to change password "http://localhost:3000/changePassword/${user._id}"`);

            //    let updated = await User.findByIdAndUpdate( { _id: user._id }, { password: user.password })
            //    if (updated) {
            //    await Token.deleteMany({ user_id: req.user._id })
            return res.status(200).send({ message: "link send to your mail" });
            //  }

        } catch (err) {
            console.log(err);
            return res.status(400).send(err, { message: "failed to change password" })
        }
    },

    // Soft Delete
    async softDelete(req, res) {
        try {
            let user = req.user
            let _id = user._id
            await User.findById(_id)

            if (user.is_deleted == true) {
                return res.status(400).send({ message: "User does not exist" })
            }
            let is_deleted = true
            const user_updated = await User.findByIdAndUpdate(_id, { is_deleted: is_deleted });

            if (!user_updated) {
                return res.status(404).send({ message: "User not found" });
            }
            await Token.deleteMany({ user_id: req.user._id })
            return res.status(200).send({ message: "User deleted successfully" });

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    profile_detail: async (req, res) => {
        try {
            var user_detail = await User.findById({
                _id: req.user._id
            })
            if (user_detail) {
                return res.status(200).send({ message: "User detail", data: user_detail });
            } else {
                return res.status(200).send({ message: "Please try again" });
            }
        } catch (error) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    createUserTeamLeader: async (req, res) => {
        try {
            let request = req.body;
            await User.findOneAndUpdate({ "name": request.teamLeader }, { "isTeamLeader": true, "underTeam": false });
            const records = await User.find().where('name').in(request.team).exec();
            let idList = records.map((id) => {
                return id._id.toString();
            });
            await User.update(
                { _id: { $in: [...idList] } },
                { $set: { underTeam: true, isTeamLeader: false } },
                { multi: true }
            );
            let teamLeader = await Teamleader.create(request);
            return res.status(200).send({ status_code: 200, teamLeader: teamLeader, message: "Team Leader created successfully." });

        } catch (error) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    async getUserTeamLeader(req, res) {
        try {
            let teamLeader = await Teamleader.find({});
            return res.status(200).json(teamLeader);
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    deleteUserTeamLeader: async (req, res) => {
        try {
            let id = req.query.id;
            let TeamLead = await Teamleader.findById(id);
            const TeamLeader = await User.find({ "name": TeamLead.teamLeader });
            await User.update({ "_id": TeamLeader[0]?._id }, { $unset: { isTeamLeader: "", underTeam: "" } });
            const records = await User.find().where('name').in(TeamLead.team).exec();
            let idList = records.map((id) => {
                return id._id.toString();
            });
            idList.map(async (id) => {
                await User.update({ "_id": id }, { $unset: { isTeamLeader: "", underTeam: "" } });
            });
            let teamLeader = await Teamleader.findByIdAndRemove(id);
            return res.status(200).send({ status_code: 200, teamLeader: teamLeader, message: "Team Leader deleted successfully." });
        } catch (error) {
            console.log(err);
            return res.status(400).send(err)
        }
    },

    // Update College
    async updateTeamLead(req, res) {
        try {
            let request = req.body;
            if (!request) {
                return res.status(400).send({ message: "All Input Field Is Required" });
            }
            let _id = req.body.id;
            const teamLead = await Teamleader.findById(_id);
            if (!teamLead) {
                return res.status(404).send({ message: "Team Lead Not Found !!" })
            }
            if (teamLead.teamLeader !== request.teamLeader) {
                const TeamLeader = await User.find({ "name": teamLead.teamLeader });
                await User.update({ "_id": TeamLeader[0]?._id }, { $unset: { isTeamLeader: "", underTeam: "" } });
                console.log(request.teamLeader);
                await User.findOneAndUpdate({ "name": request.teamLeader }, { "isTeamLeader": true, "underTeam": false });
            }
            const removeRecords = await User.find().where('name').in(teamLead.team).exec();
            let removeIdList = removeRecords.map((id) => {
                return id._id.toString();
            });
            removeIdList.map(async (id) => {
                await User.update({ "_id": id }, { $unset: { isTeamLeader: "", underTeam: "" } });
            });
            const records = await User.find().where('name').in(request.team).exec();
            let idList = records.map((id) => {
                return id._id.toString();
            });
            await User.update(
                { _id: { $in: [...idList] } },
                { $set: { underTeam: true, isTeamLeader: false } },
                { multi: true }
            );
            await Teamleader.findByIdAndUpdate(_id, request);
            return res.status(200).send({ status_code: 200, category: request, message: "Category updated successfully." })

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },

    async updateUserPermision(req, res) {
        try {
            let request = req.body;
            let _id = req.body.userId;
            const user = await User.findById(_id);
            if (!user) {
                return res.status(404).send({ message: "User Not Found !!" })
            }
            delete request["userId"];
            await User.update(
                { _id: _id },
                { $set: { permissions: request } }
            );
            return res.status(200).send({ status_code: 200, message: "Permission updated successfully." })

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },

    async sendOtpForClaim(req, res) {
        try {
            let request = req.body;
            var val = Math.floor(1000 + Math.random() * 9000);
            const college = await College.findById(request.property_id);
            if (!college) {
                return res.status(404).send({ message: "College Not Found !!" })
            }
            await College.update(
                { _id: request.property_id },
                { $set: { propertyClaimOtp: val } }
            );
            Mail.send(college.email, "" + `This is your OTP for Property Claim "${val}"`);
            return res.status(200).send({ status_code: 200, data: request, message: "Check your property email for the OTP." });
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },

    async checkOtpForClaim(req, res) {
        try {
            let request = req.body;
            console.log(request);
            const college = await College.findById(request.property_id);
            if (!college) {
                return res.status(404).send({ message: "College Not Found !!" })
            }
            if (college.propertyClaimOtp !== request.propertyClaimOtp) {
                return res.status(404).send({ status_code: 404, message: "Wrong OTP" })
            }
            await College.update(
                { _id: request.property_id },
                { $set: { propertyClaimOtp: "", propertyManagerId: request.user_id, isClaimed: true } }
            );
            return res.status(200).send({ status_code: 200, message: "Property is Claimed by you!" });
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },



}


