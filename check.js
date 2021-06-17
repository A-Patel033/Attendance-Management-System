const { adminInfo } = require("./Schemas");

const checkEmail = function checkEmail(req, res, next) {
    const email = req.body.email;
    const checkExistEmail = adminInfo.findOne({ Email: email });
    const msg = "This email alreay exits. Please use anthoer email."
    checkExistEmail.exec((err, data) => {
        if (err) throw err;
        else if (data) {
            return res.render('Add_AcademicStaff',{
                msg,
            });
        }
        next();
    })
}

const checkUserName = function checkUserName(req, res, next) {
    const userName = req.body.username;
    const msg = "This username alreay exits. Please use anthoer username."

    const checkExistUserName = adminInfo.findOne({ Username: userName });
    checkExistUserName.exec((err, data) => {
        if (err) throw err;
        else if (data) {
            return res.render('Add_AcademicStaff', { msg });
        }
        next();
    })
}

module.exports = {checkEmail, checkUserName}