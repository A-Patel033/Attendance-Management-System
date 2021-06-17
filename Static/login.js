let attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
$(document).ready(function () {
    $('#login').click(function () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let firstDigit = username.toString()[0]; 
        let secnDigit = username.toString()[1];

        if (firstDigit == "6" && secnDigit == "0" && password == "abhi123") {
            alert("Login successfully");
            window.location = "views/"; // Redirecting to other page.
            return false;
        }
        else if (firstDigit == "3" && secnDigit == "0" && password == "abhi123") {
            alert("Login successfully");
            window.location = "/Student_Home"; // Redirecting to other page.
            return false;
        }
        else {
            attempt--;// Decrementing by one.
            alert("You have left " + attempt + " attempt;");
            // Disabling fields after 3 attempts.
            if (attempt == 0) {
                document.getElementById("username").disabled = true;
                document.getElementById("password").disabled = true;
                document.getElementById("login").disabled = true;
                return false;
            }
        }
    })
})
function displayTime() { time.innerHTML = new Date(); }
setInterval(displayTime, 1000);
/*function validate(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let firstDigit = username.toString()[0];
    let secnDigit = username.toString()[1];

    if ( firstDigit == "6" && secnDigit == "0" && password == "abhi123"){
        alert ("Login successfully");
        window.location = "Staff_Home.html"; // Redirecting to other page.
        return false;
        }
    else if(firstDigit == "3" && secnDigit == "0" && password == "abhi123") {
        alert ("Login successfully");
        window.location = "Student Home.html"; // Redirecting to other page.
        return false;
    }
     else{
        attempt --;// Decrementing by one.
        alert("You have left "+attempt+" attempt;");
        // Disabling fields after 3 attempts.
        if( attempt == 0){
        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("login").disabled = true;
        return false;
        }
        }
}*/