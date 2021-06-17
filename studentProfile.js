const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo } = require("./Schemas");

const studentProfileData = function studentProfileData(req,res){
    const studentID = req.session.UserName;

    const getThisStudentProfile = Students.findOne({ ID: studentID })
    getThisStudentProfile.exec((err, data) => {
        if (data === null) {
            console.log("data is null")
        } else {
            res.render('studentProfile.pug', {
                data,
                studentID
            })
        }
    })
}

const studentProfileDataForEdit  = function userProfileDataForEdit(req,res){
    const userName = req.session.UserName;

    const getUser = Students.findOne({ ID: userName }).then((data) => {
        console.log(data);
        const name = data.name;
        const email = data.email;
        const address = data.Address;
        const area = data.Suburb;
        const postcode = data.Postcode;
        const state = data.State;
        const mNumber = data.number;

        res.render("studentProfileEdit.pug", {
            userName,
            name,
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

const saveUpdatedProfileDataOfStudent = function saveUpdatedProfileDataOfStudent(req, res){
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
   Students.findOneAndUpdate({ID:userName },{
        name: req.body.name,
        email: req.body.email,
        Address:req.body.address ,
        Suburb: req.body.suburb,
        Postcode: parseInt(req.body.postcode),
        State:  req.body.state,   
        number: parseInt(req.body.contact)
    }).then(()=>{
        res.send("Your profile data updated succefully.")
    }).catch(e => res.send("Something went wrong" + e));
    
}
module.exports = {studentProfileData, studentProfileDataForEdit, saveUpdatedProfileDataOfStudent}