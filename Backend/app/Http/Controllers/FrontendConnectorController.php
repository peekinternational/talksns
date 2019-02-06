<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use File;

class FrontendConnectorController extends Controller
{
    // SignUp Response after validation
    public function signUp(Request $request)
    {
        // extract signUp data from array-request
        $signUpData[0] = $request[0]; //name
        $signUpData[1] = $request[1]; //email
        $signUpData[2] = $request[2]; //gender
        $signUpData[3] = $request[3]; //birthdate
        $signUpData[4] = $request[4]; //birthmonth
        $signUpData[5] = $request[5]; //birthyear
        $signUpData[6] = $request[6]; //password

        $birthday = $signUpData[3] . "/" . $signUpData[4] . "/" . $signUpData[5]; // append birthdate

        // check if username already exist or not
        if (DB::table('users')->where('username', $signUpData[0])->exists()) {
            $result = ["nametaken", false];   // if username exist then store message and boolean-repsonse in an array
            return response()->json($result); // send response
        }

        // check if email already registered or not
        if (DB::table('users')->where('email', $signUpData[1])->exists()) {
            $result = ["emailtaken", false];  // if email exist then store message and boolean-repsonse in an array
            return response()->json($result); // send response
        }
        
        // insert user signUp data in database
        $dataInserted = DB::table('users')->insert([
            'username' => $signUpData[0],
            'email' => $signUpData[1],
            'gender' => $signUpData[2],
            'birthday' => $birthday,
            'password' => $signUpData[6]
        ]);

        // if data inserted, then send 'successful' response to frontend
        if ($dataInserted) {
            $result = ["signup successfull", true];
            return response()->json($result);
        }
    } // ***** SignUp Function Ends *********


    // SignIn Response after validation
    public function signIn(Request $request)
    {
        // extract signIn data from array-request
        $signInData[0] = $request[0]; // email or password
        $signInData[1] = $request[1]; // password

        // get userData from database if email exist
        $user = DB::table('users')->where('email', $signInData[0])->first();

        if ($user == null) // if email not exist then check username
        $user = DB::table('users')->where('username', $signInData[0])->first();
        
        // if user data is received from DB
        if ($user != null) {
            // (if userName OR email matches) AND (Password matches)
            if (($user->email == $signInData[0] || $user->username == $signInData[0]) && $user->password == $signInData[1]) {
                $userData = [true, $user];
                return response()->json($userData);
            } 
            // (if userName OR email not matches) OR (Password not matches)
            else if (($user->email != $signInData[0] || $user->username != $signInData[0]) || $user->password != $signInData[1]) {
                $userData = [false, ""];
                return response()->json($userData);
            }
        } else { // if userData still doesn't exist in database
            $userData = [false, ""];
            return response()->json($userData);
        }
    } // ***** SignIn Function Ends *********

    // Image Upload
    public function uploadPost(Request $request)
    {
        $userId = $request->userId;
        $item_image = $request->image;
        $description = $request->description;

        $profilePicture = "";
        if ($item_image != "") {
            $profilePicture = rand(000000, 999999) . '.' . $item_image->getClientOriginalExtension();
            $destinationPath = public_path('images');
            $item_image->move($destinationPath, $profilePicture);
            $item_info['item_image'] = $profilePicture;
        }

        // insert image in database
        $dataInserted = DB::table('posts')->insert([
            'user_id' => $userId,
            'imageFile' => $profilePicture,
            'description' => $description
        ]);

        if ($dataInserted) {
            $imageFiles = $this->retrieveImage($userId);
            $posts = DB::table('posts')->get();

            // $getPostId = DB::table('posts')->where('user_id', '=', $userId)->first();
            // $likesDataInserted = DB::table('postlikes')->insert([
            //     'user_id' => $userId,
            //     'post_id' => $getPostId->post_id//,
            //    // 'likes' => 0,
            //   //  'dislikes' => 0
            // ]);

           // $allpostLikes = null;
          //  if ($likesDataInserted) {
               // $this->allpostLikes = DB::table('postlikes')->get();
           // }

           $allpostLikes = DB::table('postlikes')->get();

            $postData = [$posts, $imageFiles, $allpostLikes];
            return response()->json($postData);
        }
    }

    // Send Image to FrontEnd's BackendConnector Service
    public function retrievePost(Request $request)
    {
        $userId = $request;
        $imageFiles = $this->retrieveImage($userId);
        $posts = DB::table('posts')->get();
        $allpostLikes = DB::table('postlikes')->get();

        $postData = [$posts, $imageFiles, $allpostLikes];
        return response()->json($postData);
    }

    // *** Retrieve Image from 'public/images' folder ***
    public function retrieveImage($userId)
    {
        $images = DB::table('posts')->select('imageFile')->get();

        $imageFiles = array();
        foreach ($images as $img) {
            $imageFiles[] = url("images/" . $img->imageFile);
        }

        return $imageFiles;
    }

    // Like the Post
    public function postLike(Request $request)
    {
        $userId = $request[0];
        $postId = $request[1];
        $likeStatus = $request[2];
        $dislikeStatus = $request[3];

        $doesPostExist = DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->first();

        if ($doesPostExist) {  // update post liked status
            DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->update(['likes' => $likeStatus]);
            DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->update(['dislikes' => $dislikeStatus]);

            $likes = DB::table('postlikes')->get();
            return response()->json($likes);

        } else {
            $dataInserted = DB::table('postlikes')->insert([
                'user_id' => $userId,
                'post_id' => $postId,
                'likes' => $likeStatus,
                'dislikes' => $dislikeStatus
            ]);

            $likes = DB::table('postlikes')->get();
            return response()->json($likes);
        }
    }

    public function test()
    {
        dd("working");
    }

} // **** Class Ends ****


        // $getIds = DB::table('postlikes')
        //     ->join('users', 'users.user_id', '=', 'postlikes.user_id')
        //     ->join('posts', 'posts.post_id', '=', 'postlikes.post_id')
        //     ->select('postlikes.*', 'users.user_id', 'posts.post_id')
        //     ->get();