/* 
Create connection with Web SQL
 */
var db_name = 'mydb';
var version = '1.0';
var db_size = 2*1024*1024;
function db_conn(){
    if(window.openDatabase){
        //connect to database
        //alert('create db');
        db = openDatabase(db_name, version, 'Test DB', db_size, function(database){
            console.log('Database creation callback');
        });
        dropTable(db, "DROP TABLE merch_uniq");
        //dropTable(db, "DROP TABLE merch_location");
        dropTable(db, "DROP TABLE merch_loc_outAthens");
        create(db);
    }else{
        alert("Web SQL Database not supported in this browser");
    }
}

function create(db){
//Using db object call a transaction to create a table
   db.transaction(function (t) {
       console.log('Transaction');
       t.executeSql("CREATE TABLE IF NOT EXISTS merch_uniq(id INTEGER PRIMARY KEY, merch_id TEXT, merch_nbr TEXT, merch_name TEXT,acq_id TEXT)")
        console.log("Merchant Unique Table has been created");
      
       t.executeSql("CREATE TABLE IF NOT EXISTS merch_location(id INTEGER PRIMARY KEY, merch_id TEXT, merch_nbr TEXT, merch_name TEXT, merch_type TEXT, acq_id TEXT, location_status TEXT, street TEXT, street_number TEXT, city TEXT, postcode TEXT, latitude REAL, longitude REAL, place_id TEXT, alg_stage TEXT)");
        console.log("Merchant Location has been created");
        
       t.executeSql("CREATE TABLE IF NOT EXISTS merch_loc_outAthens(id INTEGER PRIMARY KEY, merch_id TEXT, merch_nbr TEXT, merch_name TEXT, merch_type TEXT, acq_id TEXT, location_status TEXT, street TEXT, street_number TEXT, city TEXT, postcode TEXT, latitude REAL, longitude REAL, place_id TEXT, alg_stage TEXT)");
        console.log("Merchant Location out of Athens has been created");
    });
}
// drop table
function dropTable(db, query) {
    db.transaction(function (e) {
        e.executeSql(query);
    });
}
//Maybe will need this function if app cant handle all the unique merchant in array
function insert_uniq(db, return_all_obj){
    var data = return_all_obj();
    console.dir(data);
    db.transaction(function(t){
        for(var i in data){
            var merch_id = data[i]['merch_id'];
            var acq_id = data[i]['acq_id'];
            var merch_nbr = data[i]['merch_nbr'];
            var merch_name = data[i]['merch_name']
            t.executeSql("INSERT INTO merch_uniq (merch_id, merch_nbr, merch_name, acq_id) VALUES (?, ?, ?, ?)", [merch_id, merch_nbr, merch_name, acq_id]);
        }
    });
    console.log('Insert has been a success');
}

function insert(db, query, values){
    db.transaction(function(t){
        //console.log(values);
        t.executeSql(query,values,successHandler,errorHandler);    
        });


}
//Export data handler
function export_handler(t, results){
    var filename;
    var len = results.rows.length;
	var pagination = 6000
	var csv_data;
	var pages = len/pagination;
	if (pages <=  1){
		csv_data = "id;merch_id;merch_name;merch_type;acq_id;location_status;street;street_number;city;postcode;latitude;longitude;place_id;alg_stage\n";
		for (var i = 0; i < len; i++) {
			csv_data += results.rows.item(i).id + ";" + results.rows.item(i).merch_id + ";" + results.rows.item(i).merch_name + ";"+ results.rows.item(i).merch_type + ";" + results.rows.item(i).acq_id + ";" + results.rows.item(i).location_status + ";" + results.rows.item(i).street.replace(/[-+.^*;:_,]/g,' ') + ";" + results.rows.item(i).street_number + ";" + results.rows.item(i).city + ";" + results.rows.item(i).postcode + ";" + results.rows.item(i).latitude.toFixed(6) +";" + results.rows.item(i).longitude.toFixed(6) +";" + results.rows.item(i).place_id +";"+ results.rows.item(i).alg_stage +"\n";
		}
	}else{
		pages = Math.ceil(pages);
		var i = 0;
		var limit = pagination;
		for (var j=0; j<pages; j++){
                        console.log('pagination');
			csv_data = "id;merch_id;merch_name;merch_type;acq_id;location_status;street;street_number;city;postcode;latitude;longitude;place_id;alg_stage\n";
			while(i<limit){
				csv_data += results.rows.item(i).id + ";" + results.rows.item(i).merch_id + ";" + results.rows.item(i).merch_name + ";"+ results.rows.item(i).merch_type + ";" + results.rows.item(i).acq_id + ";" + results.rows.item(i).location_status + ";" + results.rows.item(i).street.replace(/[-+.^*;:_,]/g,' ') + ";" + results.rows.item(i).street_number + ";" + results.rows.item(i).city + ";" + results.rows.item(i).postcode + ";" + results.rows.item(i).latitude.toFixed(6) +";" + results.rows.item(i).longitude.toFixed(6) +";" + results.rows.item(i).place_id +";"+ results.rows.item(i).alg_stage +"\n";
                                i++;
                        }
                        console.log('endpage')
                        filename = 'location' + j;
			downloadFile(filename ,'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_data));
			i = limit;
			limit = limit + pagination;
			if(limit>len){
				limit = len;
			}
		}
	}
    
    /* 1st attempt failing because of the uri limit
    var csv_data = "id;merch_id;merch_name;merch_type;acq_id;location_status;street;street_number;city;postcode;latitude;longitude;place_id;alg_stage\n";
    var len = results.rows.length;
    
    for (var i = 0; i < len; i++) {
        csv_data += results.rows.item(i).id + ";" + results.rows.item(i).merch_id + ";" + results.rows.item(i).merch_name + ";"+ results.rows.item(i).merch_type + ";" + results.rows.item(i).acq_id + ";" + results.rows.item(i).location_status + ";" + results.rows.item(i).street.replace(/[-+.^*;:_,]/g,' ') + ";" + results.rows.item(i).street_number + ";" + results.rows.item(i).city + ";" + results.rows.item(i).postcode + ";" + results.rows.item(i).latitude.toFixed(6) +";" + results.rows.item(i).longitude.toFixed(6) +";" + results.rows.item(i).place_id +";"+ results.rows.item(i).alg_stage +"\n";
    }
    console.log('End');

    window.location = 'data:text/txt;charset=utf-8,' + encodeURIComponent(csv_data);
    */

}

//Export data from web sql to php controller
function export_data(db){
    db.transaction(function(t){
        var query = "SELECT * FROM merch_location"
        t.executeSql(query, [], function(t, results){ 
            var json_data = JSON.stringify(results.rows);
            $.ajax({
                type: 'POST',
                url: './uploadfile',
                //dataType: "json",
                data: json_data,
                success: function(data){
                $("#fm_webdb").text('Success! Merchants records have been send to SQL Server').slideDown(function() {
                    setTimeout(function() {
                $("#fm_webdb").slideUp();
                }, 5000);
                });
                },
                error: function(e){
                    console.log('error');
                }
            });
        });
    });
    dropTable(db, "DROP TABLE merch_location");
}

//Download file function
function downloadFile(fileName, urlData) {

    var aLink = document.createElement('a');
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click");
    aLink.download = fileName;
    aLink.href = urlData;
    aLink.dispatchEvent(evt);
}

//Query to export my stored data to csv
function export_csv(db){
    db.transaction(function(t){
      var query = "SELECT * FROM merch_location"
      t.executeSql(query, [], export_handler);  
    });
}
//Export the Merchant Location out of Athens table
function export_outAthens(db){
    db.transaction(function(t){
      var query = "SELECT * FROM merch_loc_outAthens"
      t.executeSql(query, [], export_handler);  
    });
}
function errorHandler(t, error){
    console.dir("Error "+error.message);
}

function successHandler(){
    console.dir('Inserted');
}
