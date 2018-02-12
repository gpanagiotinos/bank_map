/*Init variables*/
attikh = [{lat:38.188546, lng:23.260803},
            {lat:37.577236, lng:23.928223},
            {lat:37.872685, lng:24.422607},
            {lat:38.391186, lng:23.887024},
            {lat:38.192863, lng:23.266296}];
Athens = {lat:37.9839170, lng:23.7293600};
map = null;
service = null;
var athenspoly;
var merch_types;
var street_number;
var street;
var city;
var postcode;
var location_status;
var latitude;
var longitude;
var name;
var alg_stage = 1;
var placeid;
//markers variable
var markers = null;
//infowindow variable
var infowindow = null;
/*Initialize Map*/
function initMap(){
    map = new google.maps.Map(document.getElementById('map__canvas'), {
        center: Athens,
        zoom: 9
    });
    
    service = new google.maps.places.PlacesService(map);
    athenspoly = new google.maps.Polygon({paths: attikh, fillColor: '#FF0000'});
    athenspoly.setMap(map);
    // Add a marker clusterer to manage the markers.
    google.maps.event.addListener(map, 'idle', function() {
        if (!(markers == null)) {
        athenspoly.setMap(null);
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }
    });
}

//Add Markers to object map
function add_markers(markers_data){
        
        //loop to retrieved data from db to make a locations array
        var locations = [];
        for (var i = 0; i <=  markers_data.length - 1; i++) {
            locations.push({
                lat: Number(markers_data[i].latitude),
                lng: Number(markers_data[i].longitude) 
            });
        }
        markers = locations.map(function(location, i){
            var marker =  new google.maps.Marker({
                position: location
            });
            infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', function(){
                infowindow.setContent(markers_data[i].name);
                infowindow.open(map,marker);
            });
            return marker;
        });
}

/*find address with Google Places API*/
function getAddress(return_obj, theNext){
    //Return a row object
    var merch_obj = return_obj();
    //Trim merch_name
    var name_query = merch_obj['merch_name'].replace(/[-+.^*:_,]/g,' ');
    var merch_nbr = merch_obj['merch_nbr'];
    var merch_id = merch_obj['merch_id'];
    var acq_id = merch_obj['acq_id'];
    var request = {
        location: Athens,
        radius: '45000',
        query: name_query
    };
    //Search merchant by merchant name
    service.textSearch(request, function(result, status){ callback(result, status, name_query, merch_nbr, merch_id, acq_id)});
    //The next merchant name
    theNext();
}

//Result Manipulation
function callback(result, status, name_query, merch_nbr, merch_id, acq_id){
    console.log(name_query);
    name = name_query;
    
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            //Default values for DB
            location_status = 'uncertain_notdefined'
            postcode = '0';
            city = '0';
            street = '0';
            street_number = '0';
            merch_types = '0';
            placeid = '0';
            
            
            //Get details for every possible place       
            //counter++;
            //get Details of the places
            //console.log("Status OK "+name_query+" results "+ result.length);
            if(result.length === 1){
                location_status = 'known'
            }else{
                location_status = 'uncertain'
            }
            for(var i in result){
                var place_latlng = result[i].geometry.location;
                latitude = place_latlng.lat();
                longitude = place_latlng.lng();
                console.log(result[i].name);
                name = result[i].name;
                merch_types = result[i].types;
                placeid = result[i].place_id;
                
                //area of interest
                var area_int = google.maps.geometry.poly.containsLocation(place_latlng, athenspoly);
                //Check if  given result is in the polygon of Athens
                if(area_int){
                    //console.log(place_latlng.lat());
                    //console.log(result[i].formatted_address);
                    var place_address = result[i].formatted_address.split(",");
                    
                      if (place_address.length === 3){
                          //console.log(place_address.length );
                        //*******
                        //place_address[0] == Street and street number
                        //******
                        //split street and street number
                        var split_addr = place_address[0].split(" ");
                        split_addr.reverse();
                        //if street have street number
                        if(!(isNaN(split_addr[0]))){
                        street_number = split_addr[0];
                        //console.log(street_number);
                        split_addr.splice(0, 1);
                        }
                        split_addr.reverse();
                        var street = split_addr.join(" ");
                        //Address have been splitted to street and street number
                        
                        
                        //******
                        //place_address[1] == Town and postcode maybe
                        //******
                        //split city and post code
                        var split_town = place_address[1].split(" ");
                        split_town.reverse();
                        //console.log(split_town);
                        //if city  have post code
                        if(!(isNaN(split_town[0]))){
                        var post_code = [];
                        post_code[0] = split_town[0];
                        post_code[1] = split_town[1];
                        post_code.reverse();
                        postcode = post_code.join(" ");
                        //console.log(postcode);
                        split_town.splice(0, 2);
                        //console.log(split_town);
                        }
                        split_town.reverse();
                        city = split_town.join(" ");
                        
                        //Address have been splitted to city and postcode
                        
                        // place_address[2] == country
                        //Array of values to insert in my db 
                        var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_location (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
                        
                    }else if (place_address.length === 2){
                        //place_address[0] == Town
                         //******
                        //place_address[1] == Town and postcode maybe
                        //******
                        //split city and post code
                        var split_town = place_address[1].split(" ");
                        split_town.reverse();
                        //if city  have post code
                        if(!(isNaN(split_town[0]))){
                        var post_code = [];
                        post_code[0] = split_town[0];
                        post_code[1] = split_town[1];
                        post_code.reverse();
                        var postcode = post_code.join(" ");
                        //console.log(postcode);
                        split_town.splice(0, 1);
                        split_town.splice(1, 1);
                        }
                        split_town.reverse();
                        var city = split_town.join(" ");
                        //Address have been splitted to city and postcode
                        // place_address[1] == country
                        
                        //Array of values to insert in my db 
                        var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_location (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
                        
                    }else{
                         //Address that have more than 3 fields, AKA BAD ADDRESSES
                    street = result[i].formatted_address;
                    //Array of values to insert in my db 
                        var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_location (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
                    }
                }else{
                    //DO SOMETHING WITH VALUES THAT IS OUT OF ATHENS BOUNDARIES
                    //
                    //
                    console.log('OUT OF BOUNDARIES');
                   console.log(result[i].formatted_address); 
                   var place_address = result[i].formatted_address.split(",");
                   
                    
                      if (place_address.length === 3){
                          //console.log(place_address.length );
                        //*******
                        //place_address[0] == Street and street number
                        //******
                        //split street and street number
                        var split_addr = place_address[0].split(" ");
                        split_addr.reverse();
                        //if street have street number
                        if(!(isNaN(split_addr[0]))){
                        street_number = split_addr[0];
                        //console.log(street_number);
                        split_addr.splice(0, 1);
                        }
                        split_addr.reverse();
                        var street = split_addr.join(" ");
                        //Address have been splitted to street and street number
                        
                        
                        //******
                        //place_address[1] == Town and postcode maybe
                        //******
                        //split city and post code
                        var split_town = place_address[1].split(" ");
                        split_town.reverse();
                        //console.log(split_town);
                        //if city  have post code
                        if(!(isNaN(split_town[0]))){
                        var post_code = [];
                        post_code[0] = split_town[0];
                        post_code[1] = split_town[1];
                        post_code.reverse();
                        postcode = post_code.join(" ");
                        //console.log(postcode);
                        split_town.splice(0, 2);
                        //console.log(split_town);
                        }
                        split_town.reverse();
                        city = split_town.join(" ");
                        
                        //Address have been splitted to city and postcode
                        
                        // place_address[2] == country
                        //Array of values to insert in my db 
                        var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_loc_outAthens (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
                        
                    }else if (place_address.length === 2){
                        //place_address[0] == Town
                         //******
                        //place_address[1] == Town and postcode maybe
                        //******
                        //split city and post code
                        var split_town = place_address[1].split(" ");
                        split_town.reverse();
                        //if city  have post code
                        if(!(isNaN(split_town[0]))){
                        var post_code = [];
                        post_code[0] = split_town[0];
                        post_code[1] = split_town[1];
                        post_code.reverse();
                        var postcode = post_code.join(" ");
                        //console.log(postcode);
                        split_town.splice(0, 1);
                        split_town.splice(1, 1);
                        }
                        split_town.reverse();
                        var city = split_town.join(" ");
                        //Address have been splitted to city and postcode
                        // place_address[1] == country
                        
                        //Array of values to insert in my db 
                        var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_loc_outAthens (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
                }else{
                    //Address that have more than 3 fields, AKA BAD ADDRESSES
                    street = result[i].formatted_address;
                    //Array of values to insert in my db 
                        var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_loc_outAthens (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
                }
            }
        }
        }else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            delay++;
            nextAddress--;
            console.log(delay);
        }else{
            location_status = 'unknown'
            postcode = '0';
            city = '0';
            street = '0';
            street_number = '0';
            merch_types = '0';
            latitude = 0;
            longitude = 0;
            placeid = '0';
            //counter++;
            //Cant find place with that name
            //console.log(status);
            //Array of values to insert in my db 
            var values_array = [];
                        values_array[0] = merch_id;
                        values_array[1] = merch_nbr;
                        values_array[2] = name;
                        values_array[3] = merch_types
                        values_array[4] = acq_id
                        values_array[5] = location_status;
                        values_array[6] = street;
                        values_array[7] = street_number;
                        values_array[8] = city;
                        values_array[9] = postcode;
                        values_array[10] = latitude;
                        values_array[11] = longitude;
                        values_array[12] = placeid;
                        values_array[13] = alg_stage;
                        
                        //Insert in DB
                        var query = "INSERT INTO merch_location (merch_id, merch_nbr, merch_name, merch_type, acq_id, location_status, street, street_number, city, postcode, latitude, longitude, place_id, alg_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        insert(db, query, values_array);
            
        }

    //console.log(counter);
}