function edit_row(no) {
    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "inline-block";

    let courseCode = document.getElementById("CC_row" + no);
    let courseName = document.getElementById("CN_row" + no);
    let year = document.getElementById("year_row" + no);

    let CC_data = courseCode.innerHTML;
    let CN_data = courseName.innerHTML;
    let year_data = year.innerHTML;

    courseCode.innerHTML = "<input type='text' id='CC_text" + no + "' value='" + CC_data + "'>";
    courseName.innerHTML = "<input type='text' id='CN_text" + no + "' value='" + CN_data + "'>";
    year.innerHTML = "<input type='text' id='year_text" + no + "' value='" + year_data + "'>";

}


function save_row(no) {
    let CC_val = document.getElementById("CC_text" + no).value;
    let CN_val = document.getElementById("CN_text" + no).value;
    let year_val = document.getElementById("year_text" + no).value;


    document.getElementById("CC_row" + no).innerHTML = CC_val;
    document.getElementById("CN_row" + no).innerHTML = CN_val;
    document.getElementById("year_row" + no).innerHTML = year_val;


    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "inline-block";

    alert("Your updated details has been saved successfully.")
}

function delete_row(no) {

    document.getElementById("row" + no + "").outerHTML = "";
    alert("Your data has been deleted successfully.")
}

function add_row() {
    let new_CC = document.getElementById("new_CC").value;
    let new_CN = document.getElementById("new_CN").value;
    let new_year = document.getElementById("new_year").value;


    let table = document.getElementById("data_table");
    let table_len = (table.rows.length) - 1;
    let row = table.insertRow(table_len).outerHTML = "<tr id='row" + table_len + "'><td id='CC_row" + table_len + "'>" + new_CC + "</td><td id='CN_row" + table_len + "'>" + new_CN + "</td><td id='year_row" + table_len + "'>" + new_year + "</td><td><input type='button'class='btn btn-primary mb-2 mr-2' id='edit_button" + table_len + "' value='Edit' class='edit' onclick='edit_row(" + table_len + ")'> <input type='button' class='btn btn-primary mb-2' id='save_button" + table_len + "' value='Save' class='save' onclick='save_row(" + table_len + ")'> <input type='button' class='btn btn-primary' value='Delete' class='delete' onclick='delete_row(" + table_len + ")'></td></tr>";
    
    document.getElementById("new_CC").value = "";
    document.getElementById("new_CN").value = "";
    document.getElementById("new_year").value = "";
    alert("Your new data has been inserted successfully.")

}

function displayTime() { time.innerHTML = later.toUTCString(); }
setInterval(displayTime, 1000);