db = null;
lines = [];
nextAddress = 0;
dbarray = [];
delay = 100;
//use strict so make auto call the js function below
'use strict';
;(function(window, document, index)
    {
        //finds the hidden input element 
        var inputs = document.querySelectorAll( '.inputfile' );
        db_conn();
        //associated with the clickable label tag
        [].forEach.call(inputs, function(input){
            var label    = input.nextElementSibling,
            labelVal = label.innerHTML;
            input.addEventListener( 'change',  function(e){
                 handleFile(this.files[0]);
                 this.value = null;
            });
        });


    }(window, document, 0));


function theNext(){
    if(nextAddress < lines.length){
        setTimeout('getAddress(return_obj, theNext)', delay);
        nextAddress++;
    }else{
        //document.getElementById("ready_db").innerHTML = "All addresses have been processed";
    $("#fm_webdb").text('Success! Google Places API has Finished Searching').slideDown(function() {
        setTimeout(function() {
    $("#fm_webdb").slideUp();
        }, 5000);
    });
        //alert('web db is full');
        //export_data(db);
    }
}

//Function to call ajax post when google places api has finished
$('#ready_db').click(function(){
    //alert('hello');
    export_data(db);
});

//Handle csv file
function handleFile(files) {
   var reader = new FileReader();
   reader.readAsText(files);
   reader.onload = loadHandler;

}
function loadHandler(event){
    var csv = event.target.result;
    processdata(csv);
}
function processdata(csv){
    //Split Headers first
    var allTextLines = csv.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
   /* for (var j = 0; j < headers.length; j++) {
        headers[j] = headers[j].replace(/[^a-zA-Z ]/g, "");
    }*/
    //Create an object for every row of the csv
    for (var i=1; i<allTextLines.length; i++) {
        var row =  allTextLines[i].split(',');
        var data = {};
        //assing values to each header
        for (var x = 0; x < row.length; x++) {
            data[headers[x]] = row[x];
        }
        lines.push(data);  
    }
     insert_uniq(db, return_all_obj);
    //first call
    theNext();
    console.log(lines.length);
}
function return_obj(){
    return lines[nextAddress-1];
}

function return_all_obj(){
    return lines;
}
