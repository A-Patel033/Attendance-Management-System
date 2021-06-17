const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses } = require("./Schemas");

const addCourse = function addCourse(req,res,next){
    const myData = new Courses(req.body);
    myData.save().then(() => {
        res.send("This data has been saved to the database.")
    }).catch(() => {
        res.status(400).send("Data was not saved to database.")
    });
}

const deleteCourse = function deleteCourse(req,res,next){
    const id = req.body.id;
    Courses.findByIdAndRemove(id, (err, doc) => {
        if (!err) {
            res.send('Deleted successfully');
        } else {
            res.send("Error During deleting data");
        }
    });
}

const getPagetoEditCourseInfo = function getPagetoEditCourseInfo(req,res,next){
    const userName = req.session.UserName;
    const id = req.body.id;
    Courses.findById(id, (err, doc) => {
        if (!err) {
            res.status(200).render('Update2.pug', {
                doc,
                userName
            });
        } else {
            res.send(err);
        }
    })
}

const saveEditedCoursrInfo = function saveEditedCoursrInfo(req,re,next){
    const updateNew = Courses.findByIdAndUpdate(req.body.id, {
        CourseCode: req.body.CourseCode,
        CourseName: req.body.CourseName,
        Year: req.body.Year
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

module.exports = {addCourse,deleteCourse, getPagetoEditCourseInfo, saveEditedCoursrInfo};