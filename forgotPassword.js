const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo } = require("./Schemas");
const nodemailer = require('nodemailer');

const checkEmailToSendLink = async function checkEmail(req,res,next){
    const getEmail = req.body.email;

    await Students.findOne({email: getEmail}).then((data)=>{
        if(data === null){
            res.render('forgotPassword.pug', {
                msg: "This email does not exist. Please use correct one."
            })
        }
    }).catch((err)=>{
        res.send("Somthing worng" + err)
    })

    await adminInfo.findOne({Email: getEmail}).then((data)=>{
        if(data === null){
            res.render('forgotPassword.pug', {
                msg: "This email does not exist. Please use correct one."
            })
        }
    }).catch((err)=>{
        res.send("Somthing worng" + err)
    })
    next();
}

const sendForgotPasswordLinkMail = function sendForgotPasswordLinkMail(req,res,next){
    const getEmail = req.body.email;
    const transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use TLS
        auth: {
          user: "attendancetracker6924@gmail.com",
          pass: "A8995$3266"
        },
        tls:{
            rejectUnauthorized:false
        }
      });

      const mailOptions = {
        from: "attendancetracker6924@gmail.com",
        to: getEmail,
        subject: `Reset Password link `,
        html: `<div>
                <p>Please use below link to reset your passwrod.</p>
                <a href="http://localhost/resetPasswordForm">Click Here.</a><br><br>
                Thank you.<br><br> Regards, <br> <br>Attendance Tracker Team </p>
                </div>`,
        
    };

    transporter.sendMail(mailOptions,).then((info)=>{
        console.log("Email sent: " + info.response);
        res.render('forgotPassword.pug',{
            msg2: "Email sent Succssfully. Please check your inbox."
        })
    }).catch((err)=>{
        console.log(err)
    })
}

const checkEmailToSaveNewPasswrod = async function checkEmailToSaveNewPasswrod(req, res, next){
    const userName = req.body.username;
    const firstDigit = userName.toString()[0]
    const secnDigit = userName.toString()[1]

    if (firstDigit === "3" && secnDigit === "0"){
        await Students.findOne({ID: userName}).then((data)=>{
            if(data === null){
                 res.render('resetPasswordForm.pug', {
                     msg: "This username does not exist. Please use correct one."
                 })
             }
         }).catch(e => {res.send("Somthing went wrong" + e)})
         next();
    }else{
        await adminInfo.findOne({Username: userName}).then((data)=>{
            if(data === null){
                 res.render('resetPasswordForm.pug', {
                     msg: "This username does not exist. Please use correct one."
                 })
             }
         }).catch(e => {res.send("Somthing went wrong" + e)})
         next();
    }

    // await Students.findOne({email: getEmail}).then((data)=>{
    //    if(data === null){
    //         res.render('resetPasswordForm.pug', {
    //             msg: "This email does not exist. Please use correct one."
    //         })
    //     }
    // }).catch(e => {res.send("Somthing went wrong" + e)})

    // await adminInfo.findOne({Email: getEmail}).then((data)=>{
    //    if(data === null){
    //         res.render('resetPasswordForm.pug', {
    //             msg: "This email does not exist. Please use correct one."
    //         })
    //     }
    // }).catch(e => {res.send("Somthing went wrong" + e)})
}

module.exports = {checkEmailToSendLink, sendForgotPasswordLinkMail, checkEmailToSaveNewPasswrod}