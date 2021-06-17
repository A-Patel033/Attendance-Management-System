function edit_row(no) {
    document.getElementById("edit_button" + no).style.display = "none";
    document.getElementById("save_button" + no).style.display = "block";

    let courseCode = document.getElementById("CC_row" + no);

    let CC_data = courseCode.innerHTML;

    courseCode.innerHTML = "<input type='text' id='CC_text" + no + "' value='" + CC_data + "'>";

    document.getElementById("edit_button" + no).style.display = "Inline-block";
    document.getElementById("save_button" + no).style.display = "Inline-block";
}


function save_row(no) {
    let CC_val = document.getElementById("CC_text" + no).value;

    document.getElementById("CC_row" + no).innerHTML = CC_val;

    document.getElementById("edit_button" + no).style.display = "Inline-block";
    document.getElementById("save_button" + no).style.display = "Inline-block";
    alert("Your updated details has been saved successfully.")
}

function delete_row(no) {
    document.getElementById("row" + no + "").outerHTML = "";
}
function displayTime() { time.innerHTML = new Date(); }
setInterval(displayTime, 1000);

/*function add_row()
{
    var new_CC=document.getElementById("new_CC").value;
    var new_CN=document.getElementById("new_CN").value;
    var new_year=document.getElementById("new_year").value;


    var table=document.getElementById("data_table");
    var table_len=(table.rows.length)-1;
    var row = table.insertRow(table_len).outerHTML="<tr id='row"+table_len+"'><td id='CC_row"+table_len+"'>"+new_CC+"</td><td id='CN_row"+table_len+"'>"+new_CN+"</td><td id='year_row"+table_len+"'>"+new_year+"</td><td><input type='button'class='btn btn-primary mb-2' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' class='btn btn-primary mb-2' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' class='btn btn-primary' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr>";

    document.getElementById("new_CC").value="";
    document.getElementById("new_CN").value="";
    document.getElementById("new_year").value="";

}*/

/*function edit_row(no)
{
    document.getElementById("edit_button"+no).style.display="none";
    document.getElementById("save_button"+no).style.display="block";

    var courseCode=document.getElementById("FN_row"+no);


    var FN_data=courseCode.innerHTML;


    courseCode.innerHTML="<input type='text' id='FN_text"+no+"' value='"+FN_data+"'>";

}

function save_row(no)
{
    var FN_val=document.getElementById("FN_text"+no).value;


    document.getElementById("FN_row"+no).innerHTML=FN_val;


    document.getElementById("edit_button"+no).style.display="block";
    document.getElementById("save_button"+no).style.display="none";
}

function delete_row(no)
{
    document.getElementById("row"+no+"").outerHTML="";
}

function add_row()
{
    var new_CC=document.getElementById("new_CC").value;
    var new_CN=document.getElementById("new_CN").value;
    var new_year=document.getElementById("new_year").value;


    var table=document.getElementById("data_table");
    var table_len=(table.rows.length)-1;
    var row = table.insertRow(table_len).outerHTML="<tr id='row"+table_len+"'><td id='CC_row"+table_len+"'>"+new_CC+"</td><td id='CN_row"+table_len+"'>"+new_CN+"</td><td id='year_row"+table_len+"'>"+new_year+"</td><td><input type='button'class='btn btn-primary mb-2' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' class='btn btn-primary mb-2' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' class='btn btn-primary' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr>";

    document.getElementById("new_CC").value="";
    document.getElementById("new_CN").value="";
    document.getElementById("new_year").value="";

}*/