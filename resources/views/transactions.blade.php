@extends('layouts.index')

@section('right_bar_content')
	

	<li><a href="{!! URL::to('transactions/find')  !!} ">Find Close Merchants</a></li>

@endsection

@section('left_bar_content')

	<li><a href="{!! URL::to('transactions/known')!!}" >Merchants Map</a></li>

@endsection


@section('content')
	<body id="upload__body">
		<div id="upload__container">
			<div><h1 id="upload__title" >Card Transactions File</h1></div>
			<div>
				<input type="file" id="file" class="inputfile">
				<label for="file" id="label__container"><img id="img__container" src="img/file_upload_48px.png">Choose a file</label>
			</div>
		</div>
		<script type="text/javascript" src='js/uploadtransaction.js'></script>
	</body>
@endsection