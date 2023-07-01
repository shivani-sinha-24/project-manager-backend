import express from "express";
import UserController from "../controllers/userController.js";
import Authentication from "../middleware/auth.js";
import roleAuth from "../middleware/roleAuth.js";
import clgController from "../controllers/collegeController.js";
import categoryController from "../controllers/categoryController.js";
import statusController from "../controllers/statusController.js";
import multer from 'multer';
import bodyParser from 'body-parser';
import PropertyTypeController from "../controllers/propertyTypeController.js";
import fs from "fs";


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
      console.log(file?.fieldname, "file?.fieldname");

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
Router.post("/collegeCreate", upload.single('image'), Authentication, clgController.collegeCreate);

// Router.post("/collegeCreate", Authentication, upload.fields([
//    {
//       name: 'logo', maxCount: 1
//    }, {
//       name: 'featured_img', maxCount: 2
//    },
//    {
//       name: 'broucher', maxCount: 1
//    },
//    {
//       name: 'podcast_hindi', maxCount: 1
//    },
//    {
//       name: 'podcast_eng', maxCount: 1
//    },
// ]),
//    clgController.collegeCreate); 
//COLLEGE GET
Router.get("/getCollegeList", Authentication, clgController.getCollege);

//COLLEGE UPDATE
// Router.put("/updateCollege", Authentication, upload.single('image'), clgController.updateCollege);
Router.put("/updateCollege", Authentication, clgController.updateCollege);

//COLLEGE DELETE
Router.delete("/deleteCollege", Authentication, clgController.deleteCollege);

//COLLEGE GET
Router.get("/getCollegeAffliateApprove", Authentication, clgController.getCollegeAffliateApprove);




{/**create category Api */ }

//COLLEGE Category POST
//Router.post("/createCollegeCategory", Authentication, categoryController.createCollegeCategory); 


//COLLEGE CREATE
// Router.post("/createCategory", upload.fields([
//    {
//       name: 'image', maxCount: 1
//    },
//    {
//       name: 'logo', maxCount: 1
//    }
// ]),
//    categoryController.createCategory);
const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }])
Router.post("/createCategory", cpUpload, categoryController.createCategory);

//COLLEGE GET Category
Router.get("/getCategory", Authentication, categoryController.getCategory);

//COLLEGE UPDATE Category
Router.put("/updateCategory", Authentication, cpUpload, categoryController.updateCategory);

//CATEGORY SOFT DELETE
Router.post("/softDeleteCategory", categoryController.softDeleteCategory);

//CATEGORY RESTORE
Router.post("/restoreCategory", categoryController.restoreCategory);

//COLLEGE DELETE category
Router.delete("/deleteCategory", Authentication, categoryController.deleteCategory);






{/**status-router */ }

// status APIs

//STATUS CREATE
Router.post("/statusCreate", Authentication, statusController.createStatus);

//STATUS GET
Router.get("/statusGet", Authentication, statusController.getStatus);

//STATUS UPDATE
Router.put("/statusUpdate", Authentication, statusController.updateStatus);

//STATUS DELETE
Router.delete("/statusDelete", Authentication, statusController.deleteStatus);

//CREATE STATUS FOR
Router.post("/createStatus", Authentication, statusController.createStatusFor);






{/**property-type-router */ }

//Property Type API's

//CREATE PROPERTY TYPE
Router.post("/createPropertyType", Authentication, upload.single('property_img'), PropertyTypeController.createPropertyType);

//GET PROPERTY TYPE
//COLLEGE GET
Router.get("/getPropertyType", Authentication, PropertyTypeController.getPropertyType);

//UPDATE PROPERTY TYPE
Router.put("/updatePropertyType", Authentication, upload.single('property_img'), PropertyTypeController.updatePropertyType);

//DELETE PROPERTY TYPE
Router.delete("/deletePropertyType", Authentication, PropertyTypeController.deletePropertyType);







{/**gallery-router */ }

//GALLERY-API

//CREATE-GALLERY
Router.post("/createGallery", Authentication, upload.fields([
   {
      name: 'gallery_img', maxCount: 8
   }
]), PropertyTypeController.createGallery);

//GET GALLERY
Router.get("/getGallery", Authentication, PropertyTypeController.getGallery);

// DELETE GALLERY IMAGE
Router.put(`/delete-gallery-image`, Authentication, PropertyTypeController.deleteGalleryImg)
Router.put(`/replace-gallery-image`, Authentication, upload.single('gallery_img'), PropertyTypeController.replaceGalleryImg)
Router.put('/edit-gallery-image', Authentication, upload.fields([
   {
      name: 'gallery_img', maxCount: 8
   }
]), PropertyTypeController.editGalleryImage)



{/**team-leads-router */ }

//TEAM-LEAD-API

//CREATE TEAM LEADER
Router.post("/createTeamLeader", Authentication, upload.single('image'), PropertyTypeController.createTeamLeader);

//UPDATE TEAM LEADER
Router.put("/updateTeamLeader", Authentication, upload.single('image'), PropertyTypeController.updateTeamLeader);

//GET TEAM LEADER
Router.get("/getTeamLead", Authentication, PropertyTypeController.getTeamLead);





{/**placement-router */ }

//PLACEMENT-API

//CREATE-PLACEMENT
Router.post("/createPlacement", Authentication, upload.single('image'), PropertyTypeController.createPlacement);

//UPDATE-PLACEMENT
Router.put("/updatePlacement", Authentication, upload.single('image'), PropertyTypeController.updatePlacement);

//GET-PLACEMENT
Router.get("/getPlacement", Authentication, PropertyTypeController.getPlacement);





{/**loan-router */ }

//LOAN_API

//CREATE-LOAN
Router.post("/createLoan", Authentication, upload.single('image'), PropertyTypeController.createLoan);

//UPDATE-LOAN
Router.put("/updateLoan", Authentication, upload.single('image'), PropertyTypeController.updateLoan);

//GET-LOAN
Router.get("/getLoan", Authentication, PropertyTypeController.getLoan);




{/**scholarship-router */ }

//SCHOLARSHIP-API

//CREATE-SCHOLARSHIP
Router.post("/createScholarship", Authentication, upload.single('image'), PropertyTypeController.createScholarship);

//UPDATE-SCHOLARSHIP
Router.put("/updateScholarship", Authentication, upload.single('image'), PropertyTypeController.updateScholarship);

//GET-SCHOLARSHIP
Router.get("/getScholarship", Authentication, PropertyTypeController.getScholarship);





{/**admission-router */ }

//ADMISSION-API

//CREATE-ADMISSION
// Router.post("/createAdmission_process", Authentication,upload.single('image'),PropertyTypeController.createAdmission_process);
Router.post("/createAdmission_process", Authentication, PropertyTypeController.createAdmission_process);

//UPDATE-ADMISSION
// Router.put("/updateAdmission_process", Authentication,upload.single('image'),PropertyTypeController.updateAdmission_process);
Router.put("/updateAdmission_process", PropertyTypeController.updateAdmission_process);

//GET-ADMISSION
Router.get("/getAdmission_process", Authentication, PropertyTypeController.getAdmission_process);




{/**announcement-router */ }

//ANNOUNCEMENT-API

//CREATE-ANNONCEMENT
Router.post("/createAnnouncement", Authentication, upload.single('image'), PropertyTypeController.createAnnouncement);

//UPDATE-ANNONCEMENT
Router.put("/updateAnnouncement", Authentication, upload.single('image'), PropertyTypeController.updateAnnouncement);

//GET-ANNONCEMENT
Router.get("/getAnnouncement", Authentication, PropertyTypeController.getAnnouncement);



{/**frequently-asked-question-router */ }

//FAQS-API

//CREATE-FAQS
Router.post("/createFaqs", Authentication, PropertyTypeController.createFaqs);

//UPDATE-FAQS
Router.put("/updateFaqs", Authentication, PropertyTypeController.updateFaqs);

//GET-FAQS
Router.get("/getFaqs", Authentication, PropertyTypeController.getFaqs);


{/**Question-Answer-router */ }

//QA-API

//GET-QAS
Router.get("/getQas", Authentication, PropertyTypeController.getQas);

{/**others-router */ }

//OTHER-API

//Create Other
Router.post("/createOther", Authentication, PropertyTypeController.createOther);

//Update Other
Router.put("/updateOther", Authentication, PropertyTypeController.updateOther);

//Delete Other
Router.delete("/deleteOther", Authentication, PropertyTypeController.deleteOther);

//GET-other
Router.get("/getOther", Authentication, PropertyTypeController.getOther);


//University-Course

//CREATE-UNIVERSITY_COURSE
Router.post("/createUniversityCourse", Authentication, PropertyTypeController.createUniversityCourse);

//UPDATE-UNIVERSITY_COURSE
Router.put("/updateLoan", Authentication, upload.single('image'), PropertyTypeController.updateLoan);

//GET-UNIVERSITY_COURSE
Router.get("/getUniversityCourse", Authentication, PropertyTypeController.getUniversityCourse);

//GET-UNIVERSITY_COURSE
Router.post("/getUniversityCourseForCollege", Authentication, PropertyTypeController.getUniversityCourseForCollege);

//DELETE-UNIVERSITY_COURSE
Router.delete("/deleteUniversityCourse", Authentication, PropertyTypeController.deleteUniversityCourse);

//UPDATE-UNIVESITY-COURSE
Router.put("/updateUniversityCourse", Authentication, PropertyTypeController.updateUniversityCourse);


//College-Course

//CREATE-COLLEGE_COURSE
Router.post("/createCollegeCourse", Authentication, PropertyTypeController.createCollegeCourse);

//GET-COLLEGE_COURSE
Router.get("/getCollegeCourse", Authentication, PropertyTypeController.getCollegeCourse);

//UPDATE-UNIVESITY-COURSE
Router.put("/updateCollegeCourse", Authentication, PropertyTypeController.updateCollegeCourse);

//DELETE-UNIVERSITY_COURSE
Router.delete("/deleteCollegeCourse", Authentication, PropertyTypeController.deleteCollegeCourse);


//Team Leader
Router.post("/createUserTeamLeader", Authentication, UserController.createUserTeamLeader);

//Get Team Leader
Router.get("/getUserTeamLeader", Authentication, UserController.getUserTeamLeader);

//Delete Team Leader
Router.delete("/deleteTeamLead", Authentication, UserController.deleteUserTeamLeader);

//Team Leader update
Router.post("/updateTeamLead", Authentication, UserController.updateTeamLead);

//Send Otp For Property Claim
Router.put("/sendOtpForClaim", Authentication, UserController.sendOtpForClaim);

//Check Otp For Property Claim
Router.put("/checkOtpForClaim", Authentication, UserController.checkOtpForClaim);


export default Router;