<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>A simple map</title>
	<link rel="stylesheet" type="text/css" href="{!! asset('css/app.css') !!}">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	@yield('extend')
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto" >
	<script>
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	</script>
</head>
	<body>
		<!-- Header will be a bar with all navigation buttons -->
		<header class="custom__header">
			<div id="header__container">
				<h1 id="logo__container">
					<a href="{!! URL::to('map') !!}" class="logo__container">
						<img src="{!! asset( 'img/magoz-logo.png' ) !!}">
					</a>
				</h1>
				<ul class="left_nav_bar">

					@yield('left_bar_content')
				
				</ul>
				<ul class="right_nav_bar">

					@yield('right_bar_content')
				
				</ul>				
			</div>
		</header>
		<div id="fm_webdb">'+flash_text+'</div>
		<main>
			@yield('content')
		</main>
	</body>
</html>