import express from "express";
import UserController from "../controllers/userController.js";
import Authentication from "../middleware/auth.js";
import roleAuth from "../middleware/roleAuth.js";
import ProjectController from "../controllers/projectController.js";
import ProjectCardController from "../controllers/projectCardController.js";
import EmpController from "../controllers/EmpController.js";
import ListItemController from "../controllers/ListItemController.js";
import ProjectCardListController from "../controllers/projectCardListController.js";
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from "fs";
import InvitationController from "../controllers/InvitationController.js";
import userController from "../controllers/userController.js";


const Router = express.Router();
Router.use(bodyParser.json());


var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'images');
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});

const upload = multer({ storage: storage })

// var upload = multer({
//    storage: storage,
//    limits:
//    {
//       fileSize: '5mb'
//    },
//    fileFilter: (req, file, cb) => {

//       if (!file) cb("Image is Required", false);

//       if (  file?.fieldname == "image" || req.files.gallery_img || req.files.featured_img ) {

//          if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")) {

//             if (!(file.mimetype == "video/mp4" || file.mimetype == "MPEG-4")) {

//                if (file.mimetype == "application/pdf") cb(null, true);

//                else cb("Only .pdf format allowed!", false);

//             } cb(null, true);
//             //else cb("Only mp4 format allowed!", false);

//          } cb(null, true);
//          //else cb("Only .png, .jpg and .jpeg format allowed!", false);
//       }
//       cb(null, true);
//    }

// });


var upload1 = multer({
   storage: storage,
   limits:
   {
      fileSize: '5mb'
   },
   fileFilter: (req, file, cb) => {

      if (!file) cb("Image is Required", false);

      if (file?.fieldname == "logo" || req.files.gallery_img || req.files.featured_img) {

         if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")) {

            if (!(file.mimetype == "video/mp4" || file.mimetype == "MPEG-4")) {

               if (file.mimetype == "application/pdf") cb(null, true);

               else cb("Only .pdf format allowed!", false);

            } cb(null, true);
            //else cb("Only mp4 format allowed!", false);

         } cb(null, true);
         //else cb("Only .png, .jpg and .jpeg format allowed!", false);
      }
      cb(null, true);
   }

});



// ##### User-Router #####

//USER CREATE
Router.post("/userCreate", upload.single('image'), UserController.userRegister);

//USER LOGIN
Router.post("/userLogin", UserController.userLogin);

//LOGOUT
Router.delete('/logout', Authentication, UserController.logout);

//SEND MAIL
Router.post('/sendMail', UserController.sendMail);

//CHANGE PASSWORD
Router.put('/change-password', UserController.changePassword);

//FORGET PASSWORD
Router.put('/forget-password', UserController.forgetPassword);

//RESEND OTP
Router.post('/resend-otp', UserController.resendOtp);





//GET EDITORS
Router.get('/getEditor', Authentication, roleAuth.roleEditorSadmin, UserController.getEditor);

//GET ADMINS
Router.get('/getAdmin', Authentication, roleAuth.roleAdminSadmin, UserController.getAdmin);

//GET CALLERS
Router.get('/getCaller', Authentication, roleAuth.roleCallerSadmin, UserController.getCaller);

//GET CYBERPARTNERS
Router.get('/getCyberpartner', Authentication, roleAuth.roleCyberSadmin, UserController.getCyberpartner);

//GET SUPADMINS
Router.get('/getSuperadmin', UserController.getSuperadmin);

// USER UPDATE
Router.put('/userUpdate', Authentication, upload.single('image'), UserController.updateUsers);
Router.put('/userProfileUpdate', Authentication, upload.single('image'), UserController.updateUsersProfile);
Router.put('/userListUpdate', Authentication, upload.single('image'), UserController.updateUsers);

// USER DELETE
Router.delete('/userDelete', Authentication, UserController.deleteUsers);

// GET USER BY ROLE
Router.post('/getAllUser', Authentication, UserController.getAllRoleUsers);

//RESET PASSWORD
Router.put('/reset-password', Authentication, UserController.resetPassword);

//SOFT DELETE
Router.delete('/soft-delete', Authentication, UserController.softDelete);

//GET USER BY ID
Router.post('/getUserById', Authentication, UserController.getUserById);

//Permission Acess
Router.post("/addUserPermission", Authentication, UserController.updateUserPermision);





{/* college Router */ }

// College APIs
Router.get('/profile_detail', Authentication, UserController.profile_detail);

//COLLEGE CREATE.
Router.post("/projectCreate", upload.single('image'), Authentication, ProjectController.createProject);


Router.get("/getProjectList", Authentication, ProjectController.getProject);

//COLLEGE UPDATE
// Router.put("/updateCollege", Authentication, upload.single('image'), clgController.updateCollege);
Router.put("/updateProject", Authentication, ProjectController.updateProject);

//COLLEGE DELETE
Router.delete("/deleteProject", Authentication, ProjectController.deleteProject);


//Send mail for the register.
Router.post("/sendMailForProject", Authentication, ProjectCardListController.sendMailForProjectInvitation);



//PROJECT ROUTES
Router.get('/getProject', ProjectController.getProject)
Router.post("/createProject", ProjectController.createProject);
Router.put("/updateProject", ProjectController.updateProject);
Router.delete("/deleteProject", ProjectController.deleteProject);
Router.get('/get-project/:projectName', ProjectController.getProjectByName)


//PROJECT LIST ROUTES
Router.get("/getProjectCard/:id", ProjectCardController.getProjectCard);
Router.get("/getSampleProjectCard", ProjectCardController.getSampleProjectCard);
Router.post("/createProjectCard", ProjectCardController.createProjectCard);
Router.put("/updateProjectCards", ProjectCardController.updateProjectCards);
Router.delete("/deleteProjectCards", ProjectCardController.deleteProjectCards);

// LIST ITEMS Routes
Router.get("/getListItem", ListItemController.getListItem);
Router.post("/createtListItem", ListItemController.createtListItem);
Router.put("/updatetListItem", ListItemController.updatetListItem);
Router.delete("/deleteListItem", ListItemController.deleteListItem);

// Project Invitatio
Router.post('/share', InvitationController.share)
Router.post('/accept-invitation', InvitationController.accept)
Router.post('/reject-invitation', InvitationController.reject)

// Get User
Router.get('/user/:email', userController.getUserByEmail)

//Drag and Drop 
Router.put(`/updateMultiList`, ProjectCardController.updateMultiList)
Router.put(`/updatetSingleList`, ProjectCardController.updatetSingleList)

//Employee
const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'documents', maxCount: 1 }])
Router.post("/addEmp", cpUpload, EmpController.addEmp);
Router.get('/getEmpList', EmpController.getEmp);
Router.post('/getEmpDetailsbyId', EmpController.getEmpById);
Router.delete("/deleteEmp", EmpController.deleteEmp);
Router.put("/updateEmp", EmpController.updateEmp);

export default Router;