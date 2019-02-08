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
        $username = $request->username;
        $email = $request->email;
        $gender = $request->gender;
        $date = $request->date; //birthdate
        $month = $request->month; //birthmonth
        $year = $request->year; //birthyear
        $password = $request->password;

        $birthday = $date . "/" . $month . "/" . $year; // append birthdate

        // check if username already exist or not
        if (DB::table('users')->where('username', $username)->exists()) {
            return response()->json(['status' => false, 'message' => "nametaken"]); // send response
        }

        // check if email already registered or not
        if (DB::table('users')->where('email', $email)->exists()) {
            return response()->json(['status' => false, 'message' => "emailtaken"]); // send response
        }
        
        // insert user signUp data in database
        $dataInserted = DB::table('users')->insert([
            'username' => $username,
            'email' => $email,
            'gender' => $gender,
            'birthday' => $birthday,
            'password' => $password
        ]);

        // if data inserted, then send 'successful' response to frontend
        if ($dataInserted) {
            return response()->json(['status' => true, 'message' => "signup successfull"]);
        }
    } // ***** SignUp Function Ends *********


    // SignIn Response after validation
    public function signIn(Request $request)
    {
        // extract signIn data from array-request
        $emailOrusername = $request->emailORusername;//$request[0]; // email or password
        $password = $request->password; // password

        // get userData from database if email exist
        $user = DB::table('users')->where('email', $emailOrusername)->first();

        if ($user == null) // if email not exist then check username
        $user = DB::table('users')->where('username', $emailOrusername)->first();
        
        // if user data is received from DB
        if ($user != null) {
            // (if userName OR email matches) AND (Password matches)
            if (($user->email == $emailOrusername || $user->username == $emailOrusername) && $user->password == $password) {
                return response()->json(['status' => true, 'data' => $user]);
            } 
            // (if userName OR email not matches) OR (Password not matches)
            else if (($user->email != $emailOrusername || $user->username != $emailOrusername) || $user->password != $password) {
                return response()->json(['status' => false]);
            }
        } else { // if userData still doesn't exist in database
            return response()->json(['status' => false]);
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

            // $imageFiles = $this->retrieveImage();
            // $posts = DB::table('posts')->get();
            // $allpostLikes = DB::table('postlikes')->get();
            // return response()->json(['posts' => $posts, 'imageFiles' => $imageFiles, 'postlikes' => $allpostLikes]);

            $getUserPostData = DB::table('postlikes')
                ->join('posts', 'posts.post_id', '=', 'postlikes.post_id')
                ->select('postlikes.*', 'posts.*')->where('postlikes.user_id', '=', $userId)
                ->get();

            for ($i = 0; $i < count($getUserPostData); $i++) {
                $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $getUserPostData[$i]->imageFile)->get();
                $getUserPostData[$i]->imageFile = url("images/" . $imageFileName[0]->imageFile);
            }

            return response()->json($getUserPostData);
        }
    }

    // Send Image to FrontEnd's BackendConnector Service
    public function retrievePost(Request $request)
    {
        $userId = $request->userId;
        $getUserPostData = DB::table('postlikes')
            ->join('posts', 'posts.post_id', '=', 'postlikes.post_id')
            ->select('postlikes.*', 'posts.*')->where('postlikes.user_id', '=', $userId)
            ->get();

        for ($i = 0; $i < count($getUserPostData); $i++) {
            $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $getUserPostData[$i]->imageFile)->get();
            $getUserPostData[$i]->imageFile = url("images/" . $imageFileName[0]->imageFile);
        }

        return response()->json($getUserPostData);
    }

    // *** Retrieve Image from 'public/images' folder ***
    // public function retrieveImage()
    // {
    //     $images = DB::table('posts')->select('imageFile')->get();
    //     $imageFiles = array();
    //     foreach ($images as $img) {
    //         $imageFiles[] = url("images/" . $img->imageFile);
    //     }
    //     return $imageFiles;
    // }

    // Like the Post
    public function postLike(Request $request)
    {
        $userId = $request->userId;
        $postId = $request->postId;
        $likeStatus = $request->isLiked;
        $dislikeStatus = $request->isDisliked;

        $doesPostExist = DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->first();

        if ($doesPostExist) {  // update post liked status
            DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->update(['likes' => $likeStatus]);
            DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->update(['dislikes' => $dislikeStatus]);

            //$likes = DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->get();
            //return response()->json($likes);

            $getUserPostData = DB::table('postlikes')
                ->join('posts', 'posts.post_id', '=', 'postlikes.post_id')
                ->select('postlikes.*', 'posts.*')->where('postlikes.user_id', '=', $userId)
                ->get();

            for ($i = 0; $i < count($getUserPostData); $i++) {
                $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $getUserPostData[$i]->imageFile)->get();
                $getUserPostData[$i]->imageFile = url("images/" . $imageFileName[0]->imageFile);
            }

            return response()->json($getUserPostData);

        } else {
            $dataInserted = DB::table('postlikes')->insert([
                'user_id' => $userId,
                'post_id' => $postId,
                'likes' => $likeStatus,
                'dislikes' => $dislikeStatus
            ]);

            $getUserPostData = DB::table('postlikes')
                ->join('posts', 'posts.post_id', '=', 'postlikes.post_id')
                ->select('postlikes.*', 'posts.*')->where('postlikes.user_id', '=', $userId)
                ->get();

            for ($i = 0; $i < count($getUserPostData); $i++) {
                $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $getUserPostData[$i]->imageFile)->get();
                $getUserPostData[$i]->imageFile = url("images/" . $imageFileName[0]->imageFile);
            }

            return response()->json($getUserPostData);
            
           // $likes = DB::table('postlikes')->get();
            //return response()->json($likes);
        }
    }

    public function test()
    {
        $userId = 11;

        $getUserPostData = DB::table('postlikes')
            ->join('posts', 'posts.post_id', '=', 'postlikes.post_id')
            ->select('postlikes.*', 'posts.*')->where('postlikes.user_id', '=', $userId)
            ->get();
         
            dd($getUserPostData);
        // $getAllPosts = DB::table('posts')->get();
        // $getAllLikes = DB::table('postlikes')->get();
        // dd($getAllPosts);

        // for ($i = 0; $i < count($getAllLikes); $i++) {
        //     if ($getAllPosts[$i]->user_id == $getAllLikes->user_id && $getAllPosts[$i]->user_id == $getAllLikes->user_id) {

        //     }
        // }


        for ($i = 0; $i < count($getAllPosts); $i++) {
            $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $getUserPostData[$i]->imageFile)->get();
            $getUserPostData[$i]->imageFile = url("images/" . $imageFileName[0]->imageFile);
        }
    }

} // **** Class Ends ****