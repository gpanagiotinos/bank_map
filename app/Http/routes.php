<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::resource('map', 'MapController');
Route::get('uploadfile', 'UploadfileController@index');
Route::post('uploadfile', 'UploadfileController@store');
Route::get('transactions','UploadTransactionsController@index');
Route::get('transactions/find','UploadTransactionsController@store_procedure');
Route::get('transactions/{id}','UploadTransactionsController@show');
Route::post('transactions','UploadTransactionsController@store');




//Route::get('/', function () {
    //return view('layouts/index');
//});
/*
Route::auth();

Route::get('/home', 'HomeController@index');

Route::auth();

Route::get('/home', 'HomeController@index');
*/