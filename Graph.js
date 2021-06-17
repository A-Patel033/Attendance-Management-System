const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses } = require("./Schemas")
const plotlib = require('nodeplotlib');
const colors = require('colors');

const oneCourseGraph = async function (req, res, next) {
    const courseCode = req.body.course_code;
    const courseName = req.body.course_name;
    const intake = req.body.intake;

    const Date = [];
    const presentStudents = [];
    const absentStudents = [];

    await saveAttendance_courses.find({ course_code: courseCode, Intake: intake }).then((data) => {
        data.forEach((docs) => {
            const attedanceDate = docs.date;
            const attendancePresentStudent = docs.numberOfPresent_student;
            const attendanceAbsentStudent = docs.numberOfAbsent_student;
            Date.push(attedanceDate);
            presentStudents.push(attendancePresentStudent);
            absentStudents.push(attendanceAbsentStudent);
        })

        const barWidth = [];
        presentStudents.forEach((no) => {
            barWidth.push(0.3)
        })
        const trace1 = {
            x: Date,
            y: presentStudents,
            name: 'Present Students',
            type: 'bar',
            text: presentStudents.map(String),
            width: barWidth,
            marker: {
                color: 'green',
                opacity: 0.8,
                line: {
                    color: 'black',
                    width: 1.5
                }
            }
        };
        const trace2 = {
            x: Date,
            y: absentStudents,
            name: 'Absent Students',
            type: 'bar',
            text: absentStudents.map(String),
            width: barWidth,
            marker: {
                color: 'red',
                opacity: 0.8,
                line: {
                    color: 'black',
                    width: 1.5
                }
            }
        };
        const graph = [trace1, trace2];
        const layout = {
            title: `${courseCode}  ${courseName}  ${intake}`,
            barmode: 'group',
            xaxis: {
                tickfont: {
                    size: 15,
                    color: 'rgb(107, 107, 107)',
                    margin: '10px',
                }
            },
        };
        var config = {responsive: true}
        plotlib.plot(graph, layout, config)
        
        res.redirect('/adminAndStaffHomePage');

    }).catch((err) => {
        console.log(err + "Course Info not found");
    });
}


module.exports = { oneCourseGraph}