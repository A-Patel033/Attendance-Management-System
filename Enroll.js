const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses } = require("./Schemas");


const getStudentAndCoursesForEnrol = function getStudentAndCoursesForEnrol(req, res, nexr) {
    const userName = req.session.UserName;
    Courses.find((err, docs) => {
        if (err) {
            console.log(err)
        } else {
            Students.find((err, doc) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('Enroll_Student.pug', { courses: docs, students: doc, userName })
                }
            });
        }
    });
}

const enrollStudents = function enrollStudents(req, res, next) {
    const studentIds = req.body.studentIds;
    const courseCode = req.body.courseCode.toString();
    console.log(studentIds, courseCode)

    const checkCourse = Courses.findOne({ CourseCode: courseCode });

    checkCourse.exec((err, data) => {
        if (data == null) {
            console.log("Course Not Found")
        } else {
            if (err) throw err;
            const getId = data._id;
            const updatedStudentIds = data.StudentIds;
            studentIds.forEach(id => {
                if (!updatedStudentIds.includes(id)) {
                    updatedStudentIds.push(id);
                }
            })
            const updateNew = Courses.findOneAndUpdate({ _id: getId }, { $set: { StudentIds: updatedStudentIds } });
            updateNew.exec(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/adminAndStaffHomePage')
                }
            })
        }
    });
}

const saveCourseTOStudentSchema = function saveCourseTOStudentSchema(req, res, next) {
    const studentIds = req.body.studentIds;
    const courseCode = [req.body.courseCode.toString()];

    console.log(studentIds, courseCode)

    const getStudent = Students.find({ ID: studentIds });

    getStudent.exec((err, data) => {
        if (data === null) {
            console.log("Data is null");
        } else {
            if (err) throw err;
            // console.log(data);
            data.forEach((info) => {
                const getId = info._id;
                const updateNew = Students.findOneAndUpdate({ _id: getId }, { $addToSet: { myCourses: courseCode } });
                // updateNew.exec(function (err, data) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         res.render('Staff_Home.pug')
                //     }
                // })
            })
        }
    })
}

module.exports = { getStudentAndCoursesForEnrol, enrollStudents, saveCourseTOStudentSchema }