const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses } = require("./Schemas");
const bcrypt = require('bcrypt');


const getPageToEditStudentInfo = function getPageToEditStudentInfo (req,res,next){
    const id = req.body.id;
    Students.findById(id, (err, doc) => {
        if (!err) {
            var params = { customer: doc };
            res.status(200).render('Update1.pug', params);
        } else {
            res.send(err);
        }
    })
}

const addStudentInSystem = function addStudentInSystem(req,res,next){
    const userName = req.session.UserName;
    const ID = parseInt(req.body.ID);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.passwordConfirm;
    const number = req.body.mobileNumber; 
    const dateOfBirth = new Date(req.body.DOB);
    const DOB = dateOfBirth.toString().substring(0, 15);
    const Address = req.body.address;
    const Suburb = req.body.suburb;
    const State = req.body.state;
    const Postcode = parseInt(req.body.postcode);

    console.log(ID, name, email, password, confirmPassword, number, DOB)

    if (password != confirmPassword) {
        res.render('AddStudent.pug', { msg: 'Password Not Matched' });
    }else{
        Password = bcrypt.hashSync(password, 10)
        var studentDetail = new Students({
            ID,
            Password,
            name,
            email,
            number,
            DOB,
            Address,
            Suburb,
            State,
            Postcode
        });
        studentDetail.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                res.render('AddStudent.pug', { msg: 'Student added successfully.', userName });
            }
        });
    }
}

const checkUserNameForStudent = function checkUserName(req, res, next) {
    const userName = parseInt(req.body.ID);
    const msg = "This username alreay exits. Please use anthoer username."

    const checkExistUserName = Students.findOne({ ID: userName });
    checkExistUserName.exec((err, data) => {
        if (err) throw err;
        else if (data) {
            return res.render('AddStudent', { msg });
        }
        next();
    })
}

const deleteStudent = function deleteStudent(req,res,next){
    const id = req.body.id;
    Students.findByIdAndRemove(id, (err, doc) => {
        if (!err) {
            res.send('Deleted successfully');
        } else {
            res.send("Error During deleting data");
        }
    });
}

const saveEditedStudentInfo = function saveEditedStudentInfo(req,res,next){
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
            console.log("Error")
            res.render('Staff_Home.pug')
        }
    })
}

module.exports = {getPageToEditStudentInfo, addStudentInSystem, deleteStudent, saveEditedStudentInfo, checkUserNameForStudent}