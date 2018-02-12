@extends('layouts.index')

@section('extend')
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuhFgIlbcEsskGUjW1aBddDc1AVQwIYZM&signed_in=false&libraries=places"></script>
	<script type="text/javascript" src="js/map.js"></script>
	<script>
		    google.maps.event.addDomListener(window, "load", initMap);
	</script>
@endsection

@section('left_bar_content')

<li><a href="{!! URL::to('uploadfile') !!}"> Upload</a></li>

@endsection

@section('content')
<div id="map__canvas">Map</div>
@endsection
