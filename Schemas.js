const mongoose = require('mongoose')
const colors = require('colors');

const MongoDbconnection = mongoose.connect('mongodb://localhost/AttendanceDatabase', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}); //db for whole project

//Define Mongoose Schema and model for Add Course
const addCourseSchema = new mongoose.Schema({
    CourseCode: String,
    CourseName: String,
    StudentIds: [String],
    Year: String
});
const Courses = mongoose.model('Courses', addCourseSchema);

//Define Mongoose Schema and model for Add Students
const addStudentSchema = new mongoose.Schema({
    ID: {type: Number, required: true, unique: true },
    Password : {type: String, required: true },
    name: String,
    email:  {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    Address: String,
    Suburb : String,
    State: String,
    Postcode : Number,
    Gender: String,
    number: Number,
    DOB: Date,

});
const Students = mongoose.model('Students', addStudentSchema)

//Define Mongoose Schema and model for Username and Password 
const IDAndPassword = new mongoose.Schema({
    username: Number,
    password: String
});
const UsernamePassword = mongoose.model('UsernamePassword', IDAndPassword)  //creating Students colleation or table for students

//Define Mongoose Schema and model to save attenance according to course
const saveAttendanceBaseOncourse = new mongoose.Schema({
    course_code: String,
    course_name: String,
    Intake: String,
    date: String,
    present_student: [String],
    absent_student: [String],
    numberOfPresent_student: Number,
    numberOfAbsent_student: Number

})
const saveAttendance_courses = mongoose.model("saveAttendance_courses", saveAttendanceBaseOncourse);

const adminUserInfo = new mongoose.Schema({
    Username : {type: Number, required: true, unique: true },
    Password : {type: String, required: true },
    Firstname : String,
    Lastname : String,
    Email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    Address: String,
    Suburb : String,
    State: String,
    Postcode : Number,
    Gender: String,
    DOB: Date,
    Contact: Number,
    Courses: [String]
})
const adminInfo = mongoose.model("adminInfo", adminUserInfo);

module.exports = { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo }