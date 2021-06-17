

//Define Mongoose Schema and model for Add Course
const addCourseSchema = new mongoose.Schema({
    CourseCode: String,
    CourseName: String,
    Year: String
});
const Courses = mongoose.model('Courses', addCourseSchema);
module.exports = Courses;

//Define Mongoose Schema and model for Add Students
const addStudentSchema = new mongoose.Schema({
    ID: Number,
    name: String,
    email: String,
    number: Number,
    DOB: Date,
});
const Students = mongoose.model('Students', addStudentSchema)
module.exports = Students;