const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo } = require("./Schemas");
const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const plotlib = require('nodeplotlib');
const {studentProfileData, studentProfileDataForEdit, saveUpdatedProfileDataOfStudent} = require('./studentProfile')
const {checkEmailToSaveNewPasswrod } = require('./forgotPassword');
const bcrypt = require('bcrypt');
// const pdfMake = require('./buildPdf/pdfmake')
// const vfsFonts = require('./buildPdf/vfs_fonts.js');

// pdfMake.vfs = vfsFonts.pdfMake;


app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug') //set the View/templet directory
app.set('views', path.join(__dirname, 'views')) //set the View/templet directory

router.get('/studentHome', (req, res) => {
    const userName = parseInt(req.session.UserName);

    res.render('Student_Home.pug', userName);
});

router.get('/getCourseSelectionPageForStudent', (req, res) => {
    const sessionID = req.session.UserName
    console.log(sessionID)

    Courses.find((err, docs) => {
        if (err) {
            console.log(err)
        } else {
            const getThisStudntData = Students.findOne({ ID: sessionID })
            getThisStudntData.exec((err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(data)
                    const studentName = data.name;
                    const userName = data.ID
                    console.log(userName)
                    res.render('StudentCourseSelectionpage.pug', { courses: docs, studentName, userName })
                }
            })
        }
    });
})

router.post('/getStudentAttendance', async (req, res) => {
    const sessionID = req.session.UserName;
    const courseCode = req.body.courseCode;
    const Intake = "Intake1";

    const docsForPresent = [];
    await saveAttendance_courses.find({
        $and: [{ present_student: sessionID }, { course_code: courseCode }]
    }).then((docs) => {
        docs.forEach((docs) => {
            docsForPresent.push(docs)
        })
    }).catch(e => res.send("Something went wrong" + e))
    // console.log(docsForPresent)

    const docsForAbsent = [];
    await saveAttendance_courses.find({
        $and: [{ absent_student: sessionID }, { course_code: courseCode }]
    }).then((docs) => {
        docs.forEach((docs) => {
            docsForAbsent.push(docs)
        })
    }).catch(e => res.send("Something went wrong" + e))
    console.log(docsForAbsent)

    var studentName, userName;
    await Students.findOne({ ID: sessionID }).then((data) => {
        studentName = data.name;
        userName = data.ID;
    }).catch(e => res.send("Something went wrong" + e))

    var courseName;
    await Courses.findOne({ CourseCode: courseCode }).then((data) => {
        courseName = data.CourseName;
    }).catch(e => res.send("Something went wrong" + e))

    const courses = [];
    await Courses.find().then((data) => {
        data.forEach((data) => {
            courses.push(data)
        })
    })

    try {
        if (docsForPresent.length === 0 && docsForAbsent.length === 0) {
            console.log(" You did not enroll in this unit or did not taken any attendance for this course.")
            res.render('StudentCourseSelectionpage.pug', { msg: " You did not enroll in this unit or did not taken any attendance for this course.", courses, studentID, studentName })
        } else {
            res.render('studentViewAttendance.pug', {
                list1: docsForPresent,
                list2: docsForAbsent,
                studentName,
                userName,
                courseCode,
                courseName,
                Intake
            })
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/profile', studentProfileData )

router.get('/editProfile', studentProfileDataForEdit) 

router.post('/saveUpdatedProfile', saveUpdatedProfileDataOfStudent )

router.get('/changePassword', (req, res) => {
    res.render('studentChangePassword.pug');
})

router.post('/setPassword', checkEmailToSaveNewPasswrod, async (req, res) => {
    const username = req.body.username;
    const getNewPassword = req.body.newPassword;
    const getConfirmNewPassword = req.body.newPasswordConfirm;

    console.log(username, getNewPassword, getConfirmNewPassword)

    if (getNewPassword != getConfirmNewPassword) {
        res.render('studentChangePassword.pug', {
            msg2: 'Password does not match.'
        })
    } else {
        newPassword = bcrypt.hashSync(getNewPassword, 10)
        console.log(newPassword)
        await Students.findOneAndUpdate({ ID: username }, { $set: { Password: newPassword }})
        res.render('studentChangePassword.pug',{ msg: "New password created and saved Successfully."})
    }

})

router.get('/fullReportForStudent', (req, res) => {
    const studentID = req.session.UserName;

    const getAllAttendance = saveAttendance_courses.find({
        $or: [{ present_student: studentID }, { absent_student: studentID }]
    })

    getAllAttendance.exec((err, allDocs) => {
        if (allDocs === null) {
            console.log("data is null")
        } else {
            // console.log(allDocs, allDocs.length)
            if (err) throw err;
            const getThisStudntData = Students.findOne({ ID: studentID })
            getThisStudntData.exec((err, data) => {
                if (err) throw err;
                const studentName = data.name;
                res.render('studentFullReport.pug', {
                    allDocs,
                    studentID,
                    studentName
                })
            })
        }
    })
    // console.log(courseCodes)
})

router.post('/graph', async (req, res) => {
    const userName = req.session.UserName;
    const courseCode = req.body.course_code;
    const courseName = req.body.course_name;
    const Intake = req.body.intake;

    var totalAttendedClasses = 0, totalUnAttendedClass = 0;
    await saveAttendance_courses.countDocuments({
        $and: [{ present_student: userName }, { course_code: courseCode }]
    }).then((count) => {
        totalAttendedClasses = count;
    })

    await saveAttendance_courses.countDocuments({
        $and: [{ absent_student: userName }, { course_code: courseCode }]
    }).then((count) => {
        totalUnAttendedClass = count;
    })
    const totalClasses = totalAttendedClasses + totalUnAttendedClass;

    const yValue = [totalClasses, totalAttendedClasses, totalUnAttendedClass];
    const graph = [{
        x: ["Total Classes", "Attended Classes", "Unattended Classes"],
        y: yValue,
        width: [0.3, 0.3],
        type: 'bar',
        text: yValue.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: ['lightblue', 'green', 'red'],
            opacity: 0.8,
            line: {
                color: 'black',
                width: 2.5
            }
        }
    }]
    const layout = {
        title: `Attendance Graph for ${userName} for ${courseCode} ${courseName} ${Intake}`,
        barmode: 'stack',
        xaxis: {
            tickfont: {
                size: 15,
                color: 'rgb(107, 107, 107)',
                margin: '10px',
            }
        },
        yaxis: {
            tickfont: {
                size: 15,
                color: 'rgb(107, 107, 107)'
            }
        },
    };
    var config = { responsive: true }
    plotlib.plot(graph, layout, config)
    // res.redirect('/Student/studentHome');
})


router.get('/downloadReport', async (req, res, next) => {
    const sessionID = req.session.UserName;
    const courseCode = req.body.course_code;
    const courseName = req.body.course_name;
    const Intake = req.body.intake;

    const docsForPresent = [];
    await saveAttendance_courses.find({
        $and: [{ present_student: sessionID }, { course_code: courseCode }]
    }).then((docs) => {
        docs.forEach((docs) => {
            docsForPresent.push(docs)
        })
    }).catch(e => res.send("Something went wrong" + e))

    const docsForAbsent = [];
    await saveAttendance_courses.find({
        $and: [{ absent_student: sessionID }, { course_code: courseCode }]
    }).then((docs) => {
        docs.forEach((docs) => {
            docsForAbsent.push(docs)
        })
    }).catch(e => res.send("Something went wrong" + e))
    // console.log(docsForAbsent)

    var studentName, studentID;
    await Students.findOne({ ID: sessionID }).then((data) => {
        studentName = data.name;
        studentID = data.ID;
    }).catch(e => res.send("Something went wrong" + e))

    const pdfContent = {
        content: [
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 100, '*'],
                    body: [
                        ['CourseCode', 'CourseName', 'Date', 'Intake'],
                        [docsForPresent.course_code, docsForPresent.course_name, docsForPresent.date, docsForPresent.Intake]
                    ]
                }
            }
        ]
    }

    const pdfDoc = pdfMake.createPdf(pdfContent);
    pdfDoc.getBase64((data) => {
        res.writeHead(200,
            {
                'content-Type': 'application/pdf',
                'Content-Disposition': `attachment: filename = "${studentID}_${courseCode}.pdf"`
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download)
    })
})
module.exports = router;