@extends('layouts.index')

@section('extend')
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuhFgIlbcEsskGUjW1aBddDc1AVQwIYZM&signed_in=false&libraries=places"></script>
	<script type="text/javascript" src="js/map.js"></script>
	<script>
		    google.maps.event.addDomListener(window, "load", initMap);
	</script>
@endsection


@section('right_bar_content')
	

	<li><a href="{!! URL::to('transactions') !!}">Load Transactions</a></li>

@endsection

@section('left_bar_content')

	<li><a href="{!! URL::to('#') !!}" id="ready_db">Load Database</a></li>

@endsection

@section('content')
	<body id="upload__body">
		<div id="upload__container">
			<div><h1 id="upload__title" >Merchants File</h1></div>
			<div>
				<input type="file" id="file" class="inputfile">
				<label for="file" id="label__container"><img id="img__container" src="img/file_upload_48px.png">Choose a file</label>
			</div>
		</div>
		</body>
		<div id="map__canvas">Map</div>
		<script type="text/javascript" src="js/web_db.js"></script>
		<script type="text/javascript" src='js/filetoarray.js'></script>
		<script type="text/javascript" src="js/datatocsv.js"></script>
@endsection

<!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz49Yczle5CjnJqLaqXiMFzkiVEk_1ZvE&signed_in=false&libraries=places" </script>	 -->