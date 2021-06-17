const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require('body-parser');
const colors = require('colors');
const { on } = require("events");
const { MongoDbconnection, Courses, Students, UsernamePassword, saveAttendance_courses, adminInfo } = require("./Schemas");
const Admin = require('./Admin')
const Staff = require('./Staff')
const Student = require('./Student')
const { checkEmailToSendLink, sendForgotPasswordLinkMail, checkEmailToSaveNewPasswrod } = require('./forgotPassword');
const bcrypt = require('bcrypt');
const session = require('express-session')
const PORT = process.env.PORT || 80;

// app.post("/user/signup", signup);
app.use(session({
    secret: "AJP27AJP",
    resave: false,
    saveUninitialized: true,
    cookies: {
        maxAge: 30000
    }
}))

//Express Specific Stuff 
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//PUG SPECIFIC STUFF
app.set('view engine', 'pug') //set the View/templet directory
app.set('views', path.join(__dirname, 'views')) //set the View/templet directory

app.use('/Admin', Admin);

app.use('/Staff', Staff);

app.use('/Student', Student);

//STARTING THE SERVER    
app.listen(PORT, () => {
    console.log(colors.rainbow(`This app is running on port number${PORT}`));
});

app.get('/ResetPass', (req, res) => {
    const params = {}
    res.status(200).render('ResetPass.pug', params);
});

app.get('/adminAndStaffHomePage', (req,res)=>{
    const userName = parseInt(req.session.UserName);
    const firstDigit = userName.toString()[0]
    const secnDigit = userName.toString()[1]

    if(firstDigit === "6" && secnDigit === "0"){
        res.render('AdminHome.pug',{userName})
    }else{
        res.render('Staff_Home.pug', {userName})
    }
    
})
app.get('/studentHome', (req, res) => {
    const userName = parseInt(req.session.UserName);

    res.render('Student_Home.pug', userName);
});

app.get('/Student_Home', (req, res) => {
    const params = {}
    res.status(200).render('Student_Home.pug', params);
});

app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('appFirstPage.pug', params);
})

app.get('/LogInPage', (req, res) => {
    // console.log(req.session.UserName;
    if (req.session.UserName) {
        res.status(200).render("AdminHome.pug")
    } else {
        res.status(200).render('LogIn.pug');
    }

})

app.post('/LogIn', function (req, res, next) {
    const userName = parseInt(req.body.uname);
    const Password = req.body.pass;
    const firstDigit = userName.toString()[0]
    const secnDigit = userName.toString()[1]
    console.log("username and password " + userName, Password, firstDigit );

    if (firstDigit === "3" && secnDigit === "0") {
        const checkStudent = Students.findOne({ ID: userName })
        checkStudent.exec((err, data) => {
            if (data == null) {
                console.log("Data is null")
                res.render('LogIn.pug');
            } else {
                if (err) throw err;
                const getPassword = data.Password;
                if (bcrypt.compareSync(Password, getPassword)) {
                    // console.log("Set")
                    req.session.UserName = userName;
                    res.render("Student_Home.pug", {
                        userName,
                    });
                } else {
                    console.log('else part fail')
                    res.render('LogIn.pug', { msg:"Login Failed." });
                
                }
            }
        })
    } else {
        const checkUser = adminInfo.findOne({ Username: userName });
        checkUser.exec((err, data) => {
            if (data == null) {
                console.log("Data is null")
                res.render('LogIn.pug');
            } else {
                if (err) throw err;
                // console.log(data)
                const getPassword = data.Password;
                const msg = "Your username or password doesn't match. Please enter correct."
                if (firstDigit === "6" && secnDigit === "0") {
                    if (bcrypt.compareSync(Password, getPassword)) {
                        // console.log("Set")
                        req.session.UserName = userName;
                        console.log(req.session)
                        res.render("AdminHome.pug", {
                            userName,
                        });
                    } else {
                        console.log('else part fail')
                        res.render('LogIn.pug', { msg: "Login Failed." });

                    }
                } else {
                    if (bcrypt.compareSync(Password, getPassword)) {
                        // console.log("Set")
                        req.session.UserName = userName;
                        console.log(req.session)
                        res.render("Staff_Home.pug", {
                            userName,
                        });
                    } else {
                        console.log('else part fail')
                        res.render('LogIn.pug', { msg:"Login Failed." });
                    }
                }
            }
        })
    }
});

app.get('/Logout', (req, res) => {
    // console.log(req.session.UserName)
    if (req.session.UserName) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send("Unable to log out'");
            }
            res.redirect('/LogInPage')
        })
    } else {
        res.end();
    }
})

app.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword.pug')
})

app.post('/sendForgotPasswordLink', checkEmailToSendLink, sendForgotPasswordLinkMail)

app.get('/resetPasswordForm', (req, res) => {
    res.render('resetPasswordForm.pug');
})

app.post('/setPassword', checkEmailToSaveNewPasswrod, async (req, res) => {
    const userName = req.body.username;
    const getNewPassword = req.body.newPassword;
    const getConfirmNewPassword = req.body.newPasswordConfirm;

    console.log(userName, getNewPassword, getConfirmNewPassword)

    if (getNewPassword != getConfirmNewPassword) {
        res.render('resetPasswordForm.pug', {
            msg2: 'Password does not match.'
        })
    } else {
        newPassword = bcrypt.hashSync(getNewPassword, 10)
        console.log(newPassword)
        await adminInfo.findOneAndUpdate({ Username: userName }, { $set: { Password: newPassword }})
        res.render('resetPasswordForm.pug',{ msg: "New password created and saved Successfully."})
    }

})


