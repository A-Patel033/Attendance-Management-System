const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses } = require("./Schemas")
const nodemailer = require('nodemailer');

const getCourseDetails = function sendMailPage(req,res,next){
    const userName = req.session.UserName;
    Courses.find((err, docs) => {
        if (!err) {
            res.render('Staff_Mail.pug', {
                list: docs,
                userName
            });
        } else {
            console.log("Error in Retriving Courses list:");
        }
    });
}

const getAbsentStudentToMail = function getAbsentStudentToMail(req,res,next){
    const userName = req.session.UserName;
    const courseCode = req.body.courseCode;
    const intake = req.body.Intake;
    const attenDate = new Date(req.body.AttendanceDate);
    const date = attenDate.toString().substring(0,15);

    // console.log(courseCode, intake, date)
    const getCourse = saveAttendance_courses.findOne({ course_code: courseCode, Intake: intake, date: date })

    getCourse.exec()
        .then((data) => {
            const absentIDs = data.absent_student;
            const courseName = data.course_name
            const noOfPresentStudent = data.numberOfPresent_student;
            const noOfAbsentStudent = data.numberOfAbsent_student;
            Students.find({ ID: { $in: absentIDs }}, (err, docs)=>{
                if(!err){
                    res.render('Staff_sendMail.pug', {
                        userName,
                        list: docs,
                        courseCode,
                        courseName,
                        intake,
                        date,
                        noOfPresentStudent,
                        noOfAbsentStudent
                    });
                }else{
                    console.log("Error in Retriving absent info");
                }
            })
        }).catch((err) => {
            console.log("Course Info not found");
        });
}

const sendMail = function sendMail(req,res,next){
    const studentEmail = req.body.email;
    const courseCode = req.body.course_code;
    const courseName = req.body.course_name;
    const Intake = req.body.Intake;
    const Date = req.body.date
    console.log(studentEmail)
    const transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use TLS
        auth: {
          user: "atten***************@gmail.com",
          pass: "*********"
        },
        tls:{
            rejectUnauthorized:false
        }
      });
      
    studentEmail.forEach((email)=>{
        const mailOptions = {
            from: "attendancetracker6924@gmail.com",
            to: email,
            subject: `Absent for ${courseCode}  ${courseName} `,
            html: `<div>
                    <p style="font-size:20px;">Dear Student, <br><br>
                     I would like to inform you that you were absent in lecture <b>${courseCode}  ${courseName} on ${Date}</b>. <br><br>
                     you are advised to attend all class regularly. <br><br>
                    Thank you.<br><br> Regards, <br> <br>Attendance Tracker Team </p>
                    <img src="./Static/23091b7e-c2a2-4baf-8b23-182d2168fb6a_200x200.png">
                    </div>`,
            
        };

        transporter.sendMail(mailOptions,).then((info)=>{
            console.log("Email sent: " + info.response);
        }).catch((err)=>{
            console.log(err)
        })
    })

    setTimeout(() => {
        const userName = req.session.UserName;
        Courses.find((err, docs) => {
            if (!err) {
                res.render('Staff_Mail.pug', {
                    list: docs,
                    userName,
                    msg:"Emails sent successfully to abset students. Thank you."
                });
            } else {
                console.log("Error in Retriving Courses list:");
            }
        });
      }, 5000);

}
module.exports = {getAbsentStudentToMail, getCourseDetails, sendMail}
