const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses } = require("./Schemas")
const mongoose = require('mongoose')
const colors = require('colors');
const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const { GetStudentforAttendance, saveAttendance, seeAttendance, seeGraph } = require('./otherFunctions.js')
const { getStudentAndCoursesForEnrol, enrollStudents, saveCourseTOStudentSchema } = require('./Enroll.js')
const { addStudentInSystem, deleteStudent, checkUserNameForStudent } = require('./studentModification');
const { addCourse, deleteCourse, getPagetoEditCourseInfo } = require("./courseModification");
const {getAbsentStudentToMail, getCourseDetails, sendMail} = require('./mailSender');
const {oneCourseGraph} = require('./Graph')

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug') //set the View/templet directory
app.set('views', path.join(__dirname, 'views')) //set the View/templet directory

router.get('/', (req, res) => {
    const params = {}
    res.status(200).render('First_Page.pug', params);
});

router.get('/Login', (req, res) => {
    const params = {}
    res.status(200).render('Login.pug', params);
});

router.get('/Staff_Home', (req, res) => {
    const params = {}
    res.status(200).render('Staff_Home.pug', params);
});

router.get('/AddStudent', (req, res) => {
    const userName = req.session.UserName;
    res.status(200).render('AddStudent.pug', {userName});
});

router.get('/AddCourse', (req, res) => {
    const userName = req.session.UserName;
    res.status(200).render('AddCourse.pug', {userName});
});

router.get('/Staff_Profile', (req, res) => {
    const params = {}
    res.status(200).render('Staff_Profile.pug', params);
});

//Post method to save new Courses in database
router.post('/AddCourse', addCourse);

//Post method to save new Student in database
router.post('/AddStudent',checkUserNameForStudent,  addStudentInSystem);

router.get('/Enroll_Student', getStudentAndCoursesForEnrol);
//Enroll Students to particular course
router.post('/AddStudentToCourse', enrollStudents);

//Taking data from Students collection and Showing to student table 
router.get("/Staff_Student", (req, res) => {
    const userName = req.session.UserName;
    Students.find((err, docs) => {
        if (!err) {
            res.render('Staff_Student.pug', {
                list: docs,
                userName
            });
        } else {
            console.log('Error in Retrieving Customers list: ');
        }
    });
});

//Taking data from Courses collection and Showing to Courses table 
router.get("/Staff_Course", (req, res) => {
    const userName = req.session.UserName;
    Courses.find((err, docs) => {
        if (!err) {
            res.render('Staff_Course.pug', {
                list: docs,
                userName
            });
        } else {
            console.log('Error in Retrieving Courses list: ');
        }
    });
});

router.get("/Staff_Atten", (req, res) => {
    const userName = req.session.UserName;
    Courses.find((err, docs) => {
        if (!err) {
            res.render('Staff_Atten.pug', {
                list: docs,
                userName
            });
        } else {
            console.log("Error in Retriving Courses list:");
        }
    });
});

router.get("/Staff_Report", (req, res) => {
    const userName = req.session.UserName;
    Courses.find((err, docs) => {
        if (!err) {
            res.render('Staff_Report.pug', {
                list: docs,
                userName
            });
        } else {
            console.log("Error in Retriving Courses list:");
        }
    });
});


//Finding a document in database b Id and deleting it fro database
router.post("/deleteStudent", deleteStudent);

//Post method to find a documents form database and showing into form for editing purpose for students
router.post("/updateStudent", (req, res) => {
    const userName = req.session.UserName;
    const id = req.body.id;
    Students.findById(id, (err, doc) => {
        if (!err) {
            res.status(200).render('Update1.pug', {doc, userName});
        } else {
            res.send(err);
        }
    })

});

//Post method to save entered updated data for student
router.post("/updateNew", (req, res) => {
    const updateNew = Students.findByIdAndUpdate(req.body.id, {
        ID: req.body.ID,
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        DOB: req.body.DOB,
    });

    updateNew.exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render('Staff_Home.pug')
        }
    })
});


//Finding a document in database by Id and deleting it for database
router.post("/delete", deleteCourse);

//Post method to find a documents form database and showing into form for editing purpose for students
router.post("/update", getPagetoEditCourseInfo);

//Post method to save entered updated data for Course
router.post("/updateCourse", (req, res) => {
    const updateNew = Courses.findByIdAndUpdate(req.body.id, {
        CourseCode: req.body.CourseCode,
        CourseName: req.body.CourseName,
        Year: req.body.Year
    });

    updateNew.exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render('Staff_Home.pug')
        }
    })
});

router.post("/GetStudentforAttendance", GetStudentforAttendance);

router.post("/see_Attendance", seeAttendance);

router.post("/graph", seeGraph);

router.post("/save_Attendance", saveAttendance)

router.get('/sendMailPage', getCourseDetails)

router.post('/getStudentToSendMail', getAbsentStudentToMail)

router.post('/sendMail', sendMail);

router.post('/fullReport', (req, res) => {
    const userName = req.session.UserName;
   const fullReportData =  saveAttendance_courses.find();

   fullReportData.exec().then((data)=>{
       res.render('fullReport.pug', {
           data,
           userName
       })
   }).catch((err) => {
    console.log(err + "Course Info not found");
});
})

router.post('/oneCourseReport', (req,res)=>{
    const userName = req.session.UserName;
    const courseCode = req.body.courseCode;
    const intake = req.body.Intake;
    const oneCourseReport = saveAttendance_courses.find({course_code: courseCode, Intake: intake});

    oneCourseReport.exec().then((data)=>{
        const coursename = data[1].course_name;
        res.render('OneCourseReport.pug',{
            userName,
            document:data,
            courseCode,
            coursename,
            intake
        })
    }).catch((err) => {
        console.log(err + "Course Info not found");
    });
})

router.post('/oneCourseGraph', oneCourseGraph)

// router.post('/fullReportGraph', fullReportGraph);

module.exports = router