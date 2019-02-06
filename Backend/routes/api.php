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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::post("/signup", "FrontendConnectorController@signUp");
//Route::post("/signin", "FrontendConnectorController@signIn");

Route::post("/signup", "FrontendConnectorController@signUp");
Route::post("/signin", "FrontendConnectorController@signIn");
Route::post("/uploadpost", "FrontendConnectorController@uploadPost");
Route::post("/retrievepost", "FrontendConnectorController@retrievePost");

Route::post("/postlike", "FrontendConnectorController@postLike");
Route::post("/getlike", "FrontendConnectorController@getLikes");
//Route::post("/postdislike", "FrontendConnectorController@postDislike");
//Route::post("/getdislike", "FrontendConnectorController@getDislikes");