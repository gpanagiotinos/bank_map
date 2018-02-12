@extends('layouts.index')

@section('extend')
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuhFgIlbcEsskGUjW1aBddDc1AVQwIYZM&signed_in=false&libraries=places"></script>
	<script type="text/javascript" src="{!! asset('js/map.js') !!}"></script>
	<script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
	<script>
		    google.maps.event.addDomListener(window, "load", initMap);
	</script>
@endsection
@section('right_bar_content')
	

	<li><a href="{!! URL::to('transactions/find')  !!} "> Find Close Merchants</a></li>
	<li><a id="markers" href="{!! URL::to('transactions/known')  !!}">Show Markers</a></li>

@endsection

@section('left_bar_content')

	<li><a href="{!! URL::to('uploadfile') !!}"> Upload</a></li>
	<li><a href="{!! URL::to('transactions') !!} ">Load Transactions</a></li>

@endsection

@section('content')
@if(Session::has('flash_msg') AND (!isset($merchants)))
	<div id="fm_laravel_success">{!! session('flash_msg') !!}</div>
@endif
<div id="map__canvas">Map</div>
@if( isset($merchants) )
<script type="text/javascript">
	$('#fm_laravel_success').delay(300).slideUp(300);
	var markers_data = {!! json_encode($merchants) !!};
	add_markers(markers_data);
</script>
@endif
@endsection