const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo } = require("./Schemas");
const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session')
const { checkEmail, checkUserName } = require('./Check.js');
const { userProfileData, userProfileDataForEdit, saveUpdatedProfileData} = require('./otherFunctions.js')

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.use(session({
    secret: "AJP27AJP",
    resave: false,
    saveUninitialized: true,
    cookies: {
        maxAge: 30000
    }
}))

app.set('view engine', 'pug') //set the View/templet directory
app.set('views', path.join(__dirname, 'views')) //set the View/templet directory

router.get('/adminProfile', userProfileData) 

router.get('/editProfile', userProfileDataForEdit ) 

router.post('/saveUpdatedProfile', saveUpdatedProfileData )

router.get('/academicStaff', (req, res) => {
    const userName = req.session.UserName;
    adminInfo.find((err, docs) => {
        if (!err) {
            res.render('Admin_academicStaff.pug', {
                list: docs,
                userName
            })
        } else (
            res.status(400).render("Erro to getting academic staff info")
        )
    })
})

router.get('/addStaffForm', (req, res) => {
    const userName = req.session.UserName;
    res.status(200).render('Add_AcademicStaff.pug', {userName});
});

router.post('/addStaff', checkEmail, checkUserName, (req, res) => {
    const Username = parseInt(req.body.username);
    const password = req.body.password;
    const confirmPassword = req.body.passwordConfirm;
    const Firstname = req.body.firstname;
    const Lastname = req.body.lastname;
    const Email = req.body.email;
    const Address = req.body.address;
    const Suburb = req.body.suburb;
    const State = req.body.state;
    const Postcode = parseInt(req.body.postcode);
    const Gender = req.body.gender;
    const date = new Date(req.body.dob);
    const DOB = date.toString().substring(0, 15);
    const Contact = parseInt(req.body.contact);

    console.log(Username, password, Firstname, Lastname, Email, Address, Suburb, Postcode, State, Contact, Gender, DOB)

    if (password != confirmPassword) {
        res.render('Add_AcademicStaff.pug', { msg: 'Password Not Matched' });
    } else {
        Password = bcrypt.hashSync(password, 10)
        var userDetail = new adminInfo({
            Username,
            Password,
            Firstname,
            Lastname,
            Email,
            Address,
            Suburb,
            Postcode,
            State,   
            Contact,
            Gender,
            DOB
        });
        userDetail.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Staff Member added succefully.")
            }
        });
    };
})

router.post('/deleteStaff',(req,res)=>{
    const id = req.body.id;
    adminInfo.findByIdAndRemove(id, (err, doc) => {
        if (!err) {
            res.send('Deleted successfully');
        } else {
            res.send("Error During deleting data");
        }
    });
})

router.get('/assignCoursePage', (req, res) => {
    Courses.find((err, docs) => {
        if (err) {
            console.log(err)
        } else {
            adminInfo.find((err, doc) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('Admin_AssignCourse.pug', { courses: docs, staffs: doc })
                }
            });
        }
    });
})

router.post('/assignCourse', (req, res) => {
    const Username = req.body.username;
    const courseCodes = req.body.courseCode;
    console.log(Username, courseCodes)
    const getUser = adminInfo.findOne({ Username: Username });
    getUser.exec().then((err,data) => {
        if (data === null) {
            console.log("Data not found");
        } else {
            if (err) throw err;
            const getId = data._id;
            const updatedCourses = data.Courses;
            courseCodes.forEach(code => {
                if (!updatedCourses.includes(code)) {
                    updatedCourses.push(code);
                }
            })
            const updateNew = adminInfo.findOneAndUpdate({ _id: getId }, { $set: { Courses: updatedCourses } });
            updateNew.exec(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('Admin_Home.pug')
                }
            })
        }
    }).catch((err)=>{
        console.log(err)
    })
})
module.exports = router;