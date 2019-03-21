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

//------------------- SIGN IN-UP -----------------------------------------
Route::post("/signup", "FrontendConnectorController@signUp");
Route::post("/signin", "FrontendConnectorController@signIn");

//------------------- POSTS ----------------------------------------------
Route::post("/uploadpost", "FrontendConnectorController@uploadPost");
Route::post("/retrievepost", "FrontendConnectorController@retrievePost");
Route::post("/postlikedislike", "FrontendConnectorController@postLikeDislike");
Route::post("/comment", "FrontendConnectorController@comments");
Route::post("/reply", "FrontendConnectorController@replies");
//------------------------------------------------------------------------

//------------------- FRIEND REQUEST ---------------------------------------------------------
Route::post("/setfriendrequest", "FrontendConnectorController@friendRequest");
Route::post("/getAddFriendData", "FrontendConnectorController@getAddFriendsData");
Route::post("/friendrequestStatus", "FrontendConnectorController@friendRequestStatusUpdate");
Route::post("/unfriendrequestStatus", "FrontendConnectorController@unfriend");
//--------------------------------------------------------------------------------------------

//-------------------- OTHERS ----------------------------------------------------------------
Route::post("/profilepic", "FrontendConnectorController@uploadProfilePic");
Route::get("/maxPostId", "FrontendConnectorController@getMaxPostId");
Route::post("/getUserMaxPostId", "FrontendConnectorController@getCurrentUserMaxPostId");
//--------------------------------------------------------------------------------------------