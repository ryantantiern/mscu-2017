<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('/register', 'RegisterController@register');

Route::group(['prefix' => 'routes'], function() {
	Route::get('/', 'RouteController@routes')->middleware('auth:api');
	Route::post('/create', 'RouteController@create')->middleware('auth:api');
});

Route::group(['prefix' => 'friends'], function () {
	Route::get('/', 'FriendController@friends')->middleware('auth:api');
	Route::get('/add/{user_id}', 'FriendController@add')->middleware('auth:api');
	Route::get('/requests/received', 'FriendController@received')->middleware('auth:api');
	Route::get('/requests/sent', 'FriendController@sent')->middleware('auth:api');
	Route::get('/accept/{user_id}', 'FriendController@accept')->middleware('auth:api');
	Route::get('/decline/{user_id}', 'FriendController@decline')->middleware('auth:api');


});

