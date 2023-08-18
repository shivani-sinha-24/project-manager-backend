import Mail from "../common/Mail.js";
import Invitation from "../models/Invitation.js";
import User from "../models/userModel.js";

export default {
    
    // SENT Invitation
    async share(req, res) {
        try {
            const exist = await User.findOne({ email: req?.body?.email });

            let mailContent;
            if (exist) {
                mailContent = `
                    Dear ${exist?.fullName},
                    <p>
                        I hope this email finds you well. I am excited to invite you to join our dousoft working team, where we collaborate on innovative projects and strive for excellence together.
                    </p>
                    <p>
                        Please click on the link below to access the project:
                        ${req?.body?.url}
                    </p>
                    <p>
                        We believe your expertise and skills will be a valuable addition to our team, and we look forward to working together to achieve great things.
                    </p>
                    <p>
                        If you have any questions or need further information, feel free to reach out to us at ${process.env.MAIL_USERNAME}.
                    </p>
                    <p>
                        Looking forward to having you on board!
                    </p>
                    <p>
                        Best regards,
                    </p>
                    <p>${process.env.MAIL_USERNAME}</p>
                    <p>Dousoft It Solutions, Pvt. Ltd</p>
                    <p>
                        <a href="${req?.body?.url}/invitation" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">View Invitation</a>
                    </p>
                `;
            } else {
                mailContent = `
                <p>
                    Dear ${req?.body?.email},
                </p>
                <p>
                    I hope this email finds you well. I am excited to invite you to join our dousoft working team, where we collaborate on innovative projects and strive for excellence together.
                </p>            
                <p>
                    Once you have completed the registration process, please click on the "View Invitation" button below to access the project:
                </p>
                    ${req?.body?.url}
                <p>
                    We believe your expertise and skills will be a valuable addition to our team, and we look forward to working together to achieve great things.
                </p>           
                <p>
                    If you have any questions or need further information, feel free to reach out to us at ${process.env.MAIL_USERNAME}.
                </p>           
                <p>
                    Looking forward to having you on board!
                </p>            
                <p>
                    Best regards,
                </p>           
                <p>${process.env.MAIL_USERNAME}</p>
                <p>Dousoft It Solutions, Pvt. Ltd</p>
                <p>
                    <a href="http://localhost:3000/register" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Register Now</a>
                </p>
                `;
            }

            const existing_invitation = await Invitation.findOne({   
                project_id:req?.body?.Project_id,
                invited_user:req?.body?.email
            })
            if(existing_invitation){
                return res?.status(200).send({ message: `Invitation already sent to ${req?.body?.email} for this project` });
            }else{
                const invitation = await Invitation.create({                   
                project_id:req?.body?.Project_id,
                invited_user:req?.body?.email,
                status:'Pending',
                })

                // Send the email
                Mail.send(req?.body?.email, mailContent);
    
                return res?.status(200).send({ message: `invitation sent successfully to ${req?.body?.email}` });
            }
        } catch (error) {
            res.status(400).send(error)
        }
    },

    // Accept Invitation
    async accept (req,res){
        try {
            const {id,user_id} = req?.body;
            const user = await User.findOne({_id:user_id})
            const exist_invitation = await Invitation.findOne({
                project_id:id,
                invited_user:user?.email
            })
            if(user && exist_invitation){
                // const invitation = await Invitation.findOneAndDelete({
                //     project_id:id,
                //     invited_user:user?.email
                // })
                const updateInvitation = await Invitation.findOneAndUpdate({project_id:id,invited_user:user?.email},{$set:{status:'Accepted'}},{new:true})
                const updated_user = await User.findOneAndUpdate({_id:user?.id},{ $addToSet: { projects_assigned: id } }, {new :true})
                return res.status(200).send({message:"Invitation accepted"})
            }else{
                res.status(400).send({message:'No Invitation Found!!'})
            }
        } catch (error) {
            res.status(400).send(error)
        }
    },

    //Reject Invitation
    async reject (req,res){
        try {
            const {id,invited_user} = req?.body;
            const exist_invitation = await Invitation.findOne({
                project_id:id,
                invited_user
            })
            if(exist_invitation){
                const invitation = await Invitation.findOneAndRemove({
                    project_id:id,
                    invited_user
                })
                return res.status(200).send({message:"Invitation rejected",invitation})
            }else{
                res.status(400).send({message:'No Invitation Found!!'})
            }         
        } catch (error) {
            res.status(400).send(error)
        }
    },

}