const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo } = require("./Schemas")
const plotlib = require('nodeplotlib');
const colors = require('colors');

const GetStudentforAttendance = function GetStudentforAttendance(req, res, next) {
    const userName = req.session.UserName;
    const selectedCourse = req.body.courseCode;
    const intake = req.body.Intake;
    const selectedDate = req.body.AttendanceDate
    const checkCourse = Courses.findOne({ CourseCode: selectedCourse })
    // console.log(todayDate,selectedCourse,intake,selectedDate);

    checkCourse.exec((err, data) => {
        if (err) throw err;
        const idList = data.StudentIds;
        const selected_Course = data.CourseName
        const seleted_CouseCode = data.CourseCode
        Students.find({ ID: { $in: idList } }, (err, docs) => {
            if (!err) {
                res.render("Staff_Attendance_list.pug", {
                    userName,
                    list: docs,
                    idList,
                    selectedDate,
                    selected_Course,
                    seleted_CouseCode,
                    intake
                });
            }
            else {
                console.log("Erroe to getting student list to mark attendance.")
            }
        })

    });
}

const saveAttendance = function (req, res, next) {
    const course_code = req.body.course_code;
    const course_name = req.body.course_name;
    const attenDate = new Date(req.body.date);
    const date = attenDate.toString().substring(0, 15);
    const Intake = req.body.Intake;
    const present_student = req.body.ID;
    const numberOfPresent_student = present_student.length;
    // console.log(date,attenDate)
    const getCourse = Courses.findOne({ CourseCode: course_code });

    const absent_student = [];

    getCourse
        .exec()
        .then((data) => {
            const studentsForthisCourse = data.StudentIds;
            // console.log(studentsForthisCourse);
            studentsForthisCourse.forEach((id) => {
                if (!present_student.includes(id)) {
                    absent_student.push(id);
                }
            });
            const numberOfAbsent_student = absent_student.length;
            // console.log(numberOfAbsent_student);
            const savedAttendance = new saveAttendance_courses({
                course_code,
                course_name,
                date,
                Intake,
                present_student,
                absent_student,
                numberOfPresent_student,
                numberOfAbsent_student

            });
            savedAttendance.save().then(() => {
                res.status(400).send("Data has been saved successfully.");
            });
        })
        .catch((err) => {
            console.log("Course Info not found");
        });
};

const seeAttendance = async function seeAttendance(req, res, next) {
    const userName = req.session.UserName;
    const courseCode = req.body.courseCode
    const intake = req.body.Intake
    const attendate = new Date(req.body.AttendanceDate);
    const date = attendate.toString().substring(0, 15);
    console.log(courseCode, intake, date)

    const presetnStudentIDs = [];
    const absentStudnetIDs = [];
    await saveAttendance_courses.findOne({ course_code: courseCode, Intake: intake, date: date }).then((docs)=>{
        const presentID = docs.present_student;
        const absentID = docs.absent_student;
        presentID.forEach((id)=>{
            presetnStudentIDs.push(id);
        })
        absentID.forEach((id)=>{
            absentStudnetIDs.push(id);
        })
    }).catch(e => res.send("Something went wrong" + e));

    const presentStudentData = [];
    await Students.find({ ID: { $in: presetnStudentIDs }}).then((docs)=>{
        docs.forEach((data)=>{
            presentStudentData.push(data)
        })
    }).catch(e => res.send("Something went wrong" + e));

    const absentStudentDate = [];
    await Students.find({ ID: { $in: absentStudnetIDs }}).then((docs)=>{
        docs.forEach((data)=>{
            absentStudentDate.push(data)
        })
    }).catch(e => res.send("Something went wrong" + e));

    const numberOfStudents_present = presetnStudentIDs.length;
    const numberOfStudents_absent = absentStudnetIDs.length

    await Courses.findOne({ CourseCode: courseCode }).then((courseDoc)=>{
        const course_name = courseDoc.CourseName;
        const course_code = courseDoc.CourseCode;
        console.log(course_name, course_code)
        res.render("Staff_seeReport.pug", {
            userName,
            presentStudentData,
            absentStudentDate,
            course_name,
            course_code,
            intake,
            date,
            numberOfStudents_present,
            numberOfStudents_absent
        })
    }).catch(e => res.send("Something went wrong" + e));
}

const seeGraph = async function seeGraph(req, res, next) {
    const courseCode = req.body.course_code;
    const courseName = req.body.course_name;
    const intake = req.body.Intake;
    const Date = req.body.date;

    await saveAttendance_courses.findOne({ course_code: courseCode, Intake: intake, date: Date }).then((data) => {
        if (data === null) {
            console.log("data not found");
        }
        else {
            const noOfPresntStudent = data.numberOfPresent_student;
            const noOfAbsentStudent = data.numberOfAbsent_student;

            const xValue = ['Present Students', 'Absent Student'];
            const yValue = [noOfPresntStudent, noOfAbsentStudent]
            const graph = [{
                x: xValue,
                y: yValue,
                width: [0.3, 0.3],
                type: 'bar',
                text: yValue.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                marker: {
                    color: 'lightgreen',
                    opacity: 0.8,
                    line: {
                        color: 'black',
                        width: 2.5
                    }
                }
            }]
            const layout = {
                title: `Attendance Graph for ${courseCode} ${courseName} ${intake} Date : ${Date}`,
                barmode: 'stack',
                xaxis: {
                    tickfont: {
                        size: 20,
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
            plotlib.plot(graph, layout)
            res.redirect('/adminAndStaffHomePage');
        }
    }).catch(e => res.send("Something went wrong" + e));
}

const userProfileData = function userProfileData(req,res){
    const userName = req.session.UserName;

    const getUser = adminInfo.findOne({ Username: userName }).then((data) => {
        console.log(data);
        const fname = data.Firstname;
        const lname = data.Lastname;
        const email = data.Email;
        const address = data.Address;
        const area = data.Suburb;
        const postcode = data.Postcode;
        const state = data.State;
        const mNumber = data.Contact;

        res.render("Staff_Profile", {
            userName,
            fname,
            lname,
            email,
            address,
            area,
            postcode,
            state,
            mNumber
        })
    }).catch((err) => {
        console.log(err + " Error getting your information")
    })
}

const userProfileDataForEdit  = function userProfileDataForEdit(req,res){
    const userName = req.session.UserName;

    const getUser = adminInfo.findOne({ Username: userName }).then((data) => {
        console.log(data);
        const fname = data.Firstname;
        const lname = data.Lastname;
        const email = data.Email;
        const address = data.Address;
        const area = data.Suburb;
        const postcode = data.Postcode;
        const state = data.State;
        const mNumber = data.Contact;

        res.render("ProfileEdit.pug", {
            userName,
            fname,
            lname,
            email,
            address,
            area,
            postcode,
            state,
            mNumber
        })
    }).catch((err) => {
        console.log(err + " Error getting your information")
    })
}

const saveUpdatedProfileData = function saveUpdatedProfileData(req, res){
    const userName = req.session.UserName;
    // const Firstname = req.body.firstname;
    // const Lastname = req.body.lastname;
    // const Email = req.body.email;
    // const Address = req.body.address;
    // const Suburb = req.body.suburb;
    // const State = req.body.state;
    // const Postcode = parseInt(req.body.postcode);
    // const Contact = parseInt(req.body.contact);

    // console.log(Firstname, Lastname, Email, Address, Suburb, Postcode, State, Contact)
    const userDetail = adminInfo.findOneAndUpdate({Username:userName },{
        Firstname: req.body.firstname,
        Lastname: req.body.firstname,
        Email: req.body.email,
        Address:req.body.address ,
        Suburb: req.body.suburb,
        Postcode: parseInt(req.body.postcode),
        State:  req.body.state,   
        Contact: parseInt(req.body.contact)
    }).then(()=>{
        res.send("Your profile data updated succefully.")
    }).catch(e => res.send("Something went wrong" + e));
    
}

module.exports = { GetStudentforAttendance, saveAttendance, seeAttendance, seeGraph, userProfileData,userProfileDataForEdit, saveUpdatedProfileData }