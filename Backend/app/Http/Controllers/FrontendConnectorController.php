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
            
            $allPosts = DB::table('posts')->get();
            $allPostLikes = DB::table('postlikes')->get();

            foreach ($allPosts as &$post) {
                $post->getPost = DB::table('postlikes')->select('likes', 'dislikes')->where('postlikes.post_id', '=', $post->post_id)->get();
                $post->totalLiked = DB::table('postlikes')->select('likes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.likes', '=', 1)->count();
                $post->totaldisLiked = DB::table('postlikes')->select('dislikes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.dislikes', '=', 1)->count();
                $post->name = DB::table('users')->select('username')->where('users.user_id', '=', $post->user_id)->first();

                $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $post->imageFile)->get();

                if ($post->imageFile != '')
                    $post->imageFile = url("images/" . $imageFileName[0]->imageFile);
                else
                    $post->imageFile = '';
            }

            return response()->json(['posts' => $allPosts, 'postlikes' => $allPostLikes]);
        }
    }

    // Send Image to FrontEnd's BackendConnector Service
    public function retrievePost(Request $request)
    {
        $userId = $request->userId;

        $allPosts = DB::table('posts')->get();
        $allPostLikes = DB::table('postlikes')->get();

        foreach ($allPosts as &$post) {
            $post->getPost = DB::table('postlikes')->select('likes', 'dislikes')->where('postlikes.post_id', '=', $post->post_id)->get();
            $post->totalLiked = DB::table('postlikes')->select('likes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.likes', '=', 1)->count();
            $post->totaldisLiked = DB::table('postlikes')->select('dislikes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.dislikes', '=', 1)->count();
            $post->name = DB::table('users')->select('username')->where('users.user_id', '=', $post->user_id)->first();
            $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $post->imageFile)->get();

            if ($post->imageFile != '')
                $post->imageFile = url("images/" . $imageFileName[0]->imageFile);
            else
                $post->imageFile = '';
        }

        return response()->json(['posts' => $allPosts, 'postlikes' => $allPostLikes]);
    }

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

            $allPosts = DB::table('posts')->get();
            $allPostLikes = DB::table('postlikes')->get();

            foreach ($allPosts as &$post) {
                $post->getPost = DB::table('postlikes')->select('likes', 'dislikes')->where('postlikes.post_id', '=', $post->post_id)->get();
                $post->totalLiked = DB::table('postlikes')->select('likes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.likes', '=', 1)->count();
                $post->totaldisLiked = DB::table('postlikes')->select('dislikes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.dislikes', '=', 1)->count();
                $post->name = DB::table('users')->select('username')->where('users.user_id', '=', $post->user_id)->first();
                $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $post->imageFile)->get();

                if ($post->imageFile != '')
                    $post->imageFile = url("images/" . $imageFileName[0]->imageFile);
                else
                    $post->imageFile = '';
            }

            return response()->json(['posts' => $allPosts, 'postlikes' => $allPostLikes]);

        } else {
            $dataInserted = DB::table('postlikes')->insert([
                'user_id' => $userId,
                'post_id' => $postId,
                'likes' => $likeStatus,
                'dislikes' => $dislikeStatus
            ]);

            $allPosts = DB::table('posts')->get();
            $allPostLikes = DB::table('postlikes')->get();

            foreach ($allPosts as &$post) {
                $post->getPost = DB::table('postlikes')->select('likes', 'dislikes')->where('postlikes.post_id', '=', $post->post_id)->get();
                $post->totalLiked = DB::table('postlikes')->select('likes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.likes', '=', 1)->count();
                $post->totaldisLiked = DB::table('postlikes')->select('dislikes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.dislikes', '=', 1)->count();
                $post->name = DB::table('users')->select('username')->where('users.user_id', '=', $post->user_id)->first();
                $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $post->imageFile)->get();

                if ($post->imageFile != '')
                    $post->imageFile = url("images/" . $imageFileName[0]->imageFile);
                else
                    $post->imageFile = '';
            }

            return response()->json(['posts' => $allPosts, 'postlikes' => $allPostLikes]);
        }
    }

    // public function test() // for testing purposes
    // {
    //     $userId = 1;

    //     $allPosts = DB::table('posts')->get();
    //     $allPostLikes = DB::table('postlikes')->get();
    //     //$userData = DB::table('users')->get();
        
    //     foreach ($allPosts as &$post) {
    //         $post->getPost = DB::table('postlikes')->select('likes', 'dislikes')->where('postlikes.post_id', '=', $post->post_id)->get();
    //         $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $post->imageFile)->get();
            
    //         if ($post->imageFile != '')
    //             $post->imageFile = url("images/" . $imageFileName[0]->imageFile);
    //         else
    //             $post->imageFile = '';

    //         $post->totalLiked = DB::table('postlikes')->select('likes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.likes', '=', 1)->count();
    //         $post->totaldisLiked = DB::table('postlikes')->select('dislikes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.dislikes', '=', 1)->count();
    //         $post->name = DB::table('users')->select('username')->where('users.user_id', '=', $post->user_id)->first();
    //     }

        
    //     dd($allPosts);
    // }

} // **** Class Ends *****