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

Route::post("/comment", "FrontendConnectorController@comments");
Route::post("/reply", "FrontendConnectorController@replies");

Route::post("/profilepic", "FrontendConnectorController@profilePic");
Route::post("/setfriendrequest", "FrontendConnectorController@friendRequest");
Route::post("/getAddFriendData", "FrontendConnectorController@getAddFriendsData");
Route::post("/friendrequestStatus", "FrontendConnectorController@friendRequestStatusUpdate");
Route::post("/unfriendrequestStatus", "FrontendConnectorController@unfriend");

Route::get("/maxPostId", "FrontendConnectorController@getMaxPostId");
Route::post("/getMaxPostId", "FrontendConnectorController@getCurrentUserMaxPostId");