<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

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
        $emailOrusername = $request->emailORusername; //$request[0]; // email or password
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

        $uploadPicture = "";
        if ($item_image != "") {
            $uploadPicture = rand(000000, 999999) . '.' . $item_image->getClientOriginalExtension();
            $destinationPath = public_path('images');
            $item_image->move($destinationPath, $uploadPicture);
            $item_info['item_image'] = $uploadPicture;
        }

        // insert image in database
        $dataInserted = DB::table('posts')->insert([
            'user_id' => $userId,
            'imageFile' => $uploadPicture,
            'description' => $description
        ]);

        if ($dataInserted) {
            return response()->json($this->getandSendAllPostData($userId));
        }
    }

    // Send Image to FrontEnd's BackendConnector Service
    public function retrievePost(Request $request)
    {
        $userId = $request->userId;
        return response()->json($this->getandSendAllPostData($userId));
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

            return response()->json($this->getandSendAllPostData($userId));
        } else {
            DB::table('postlikes')->insert([
                'user_id' => $userId,
                'post_id' => $postId,
                'likes' => $likeStatus,
                'dislikes' => $dislikeStatus
            ]);

            return response()->json($this->getandSendAllPostData($userId));
        }
    }

    public function comments(Request $request)
    {
        $userId = $request->userId;
        $postId = $request->postId;
        $comment = $request->comment;

        DB::table('comments')->insert([
            'user_id' => $userId,
            'post_id' => $postId,
            'description' => $comment,
        ]);

        return response()->json($this->getandSendAllPostData($userId));
    }

    public function replies(Request $request)
    {
        $userId = $request->userId;
        $postId = $request->postId;
        $commentId = $request->commentId;
        $reply = $request->commentReply;

        DB::table('replycomments')->insert([
            'user_id' => $userId,
            'post_id' => $postId,
            'comment_id' => $commentId,
            'replydescription' => $reply,
        ]);

        return response()->json($this->getandSendAllPostData($userId));
    }

    public function profilePic(Request $request)
    {
        $userId = $request->userId;
        $profilepic = $request->profilePic;

        $uploadPicture = "";
        if ($profilepic != "") {
            $uploadPicture = rand(000000, 999999) . '.' . $profilepic->getClientOriginalExtension();
            $destinationPath = public_path('profilepics');
            $profilepic->move($destinationPath, $uploadPicture);
            $item_info['item_image'] = $uploadPicture;
        }

        DB::table('users')->where('user_id', '=', $userId)->update(['ProfilePic' => $uploadPicture]);

        return response()->json($this->getandSendAllPostData($userId));
    }

    //*********************************************************************************************************************8 */
    public function friendRequest(Request $request)
    {
        $senderId = $request->userId;
        $receiverId = $request->receiverId;
        $requestStatus = $request->requestStatus;

        DB::table('friends')->insert([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'requeststatus' => $requestStatus
        ]);
        return response()->json($this->setFriendsData($senderId));
    }

    public function friendRequestStatusUpdate(Request $request)
    {
        $userId = $request->userId;
        $senderId = $request->senderId;
        $requestStatus = $request->requestStatus;

        DB::table('friends')->where('sender_id', '=', $senderId)->update(['requeststatus' => $requestStatus]);
        return response()->json($this->setFriendsData($userId));
    }

    public function getAddFriendsData(Request $request)
    {
        $userId = $request->userId;
        return response()->json($this->setFriendsData($userId));
    }


    public function setFriendsData($userId)
    {
        // ****************************************************************************************
        // ****************************************************************************************
        // ************** THIS CODE WILL BE REMOVED LATER *********************************************
        // ****************************************************************************************
        // **************************************************************************************
        $sentfriendsData = DB::table("friends")->where("friends.sender_id", '!=', null)->where("friends.sender_id", '=', $userId)->get();
        $receivedfriendsData = DB::table("friends")->where("friends.receiver_id", '!=', null)->where("friends.receiver_id", '=', $userId)->get();
        $friendRequestSent = null;
        $friendRequestReceived = null;

        if (count($sentfriendsData) != 0) {
            $friendRequestSent = DB::table('users')
                ->where("friends.sender_id", '=', $userId)
                ->join('friends', 'friends.receiver_id', '=', 'users.user_id')
                ->select('users.user_id', 'users.username', 'users.ProfilePic', 'friends.*')
                ->get();
        }

        if (count($receivedfriendsData) != 0) {
            $friendRequestReceived = DB::table('users')
                ->where("friends.receiver_id", '=', $userId)
                ->join('friends', 'friends.sender_id', '=', 'users.user_id')
                ->select('users.user_id', 'users.username', 'users.ProfilePic', 'friends.*')
                ->get();
        }

        $y = 0;
        while ($y < count($friendRequestSent)) {
            if ($friendRequestSent[$y]->ProfilePic != null || $friendRequestSent[$y]->ProfilePic != "")
                $friendRequestSent[$y]->ProfilePic = url("profilepics/" . $friendRequestSent[$y]->ProfilePic);
            else
                $friendRequestSent[$y]->ProfilePic = '';
            $y++;
        }

        $z = 0;
        while ($z < count($friendRequestReceived)) {
            if ($friendRequestReceived[$z]->ProfilePic != null || $friendRequestReceived[$z]->ProfilePic != "")
                $friendRequestReceived[$z]->ProfilePic = url("profilepics/" . $friendRequestReceived[$z]->ProfilePic);
            else
                $friendRequestReceived[$z]->ProfilePic = '';
            $z++;
        }

        // ****************************************************************************************
        // ****************************************************************************************
        // ****************************************************************************************

        $allFriendRequestData = DB::table('friends')->get();
        $profilePicName = DB::table('users')->select('user_id', 'ProfilePic')->where('ProfilePic', '!=', null)->get();
        $allUserdata = DB::table('users')->select('user_id', 'username', 'ProfilePic')->get();

        foreach ($allFriendRequestData as &$friendRequest) {
            $friendRequest->ProfilePic = '';
        }
        foreach ($profilePicName as $profilepic) {
            foreach ($allFriendRequestData as &$friendRequest) {
                if ($friendRequest->sender_id == $profilepic->user_id) {
                    $friendRequest->ProfilePic = url("profilepics/" . $profilepic->ProfilePic);
                }
                $friendRequest->username = DB::table('users')->select('username')->where('user_id', '=', $friendRequest->sender_id)->get();
            }

            foreach ($allUserdata as &$userdata) {
                if ($userdata->user_id == $profilepic->user_id) {
                    $userdata->ProfilePic = url("profilepics/" . $userdata->ProfilePic);
                }
            }
        }

        return ['allFriendRequests' =>  $allFriendRequestData, 'allUserdata' => $allUserdata];
    }

    //*********************************************************************************************************************8 */



    //************************************************ */
    public function getandSendAllPostData($userId)
    {
        $allPosts = DB::table('posts')->get();
        $allPostLikes = DB::table('postlikes')->get();
        $allPostComments = DB::table('comments')->get();
        $usersName = DB::table('users')->select('user_id', 'username')->get();
        $replies = DB::table('replycomments')->get();
        $profilepicFileNames = DB::table('users')->select('user_id', 'ProfilePic')->where('ProfilePic', '!=', null)->get();
        $loggedInUserData = DB::table('users')->select('user_id', 'username', 'email', 'gender', 'birthday', 'ProfilePic')->where('user_id', '=', $userId)->get();

        $loggedInUserProfilePic = "";

        foreach ($allPosts as &$post) {
            $post->getPost = DB::table('postlikes')->select('likes', 'dislikes')->where('postlikes.post_id', '=', $post->post_id)->get();
            $post->totalLiked = DB::table('postlikes')->select('likes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.likes', '=', 1)->count();
            $post->totaldisLiked = DB::table('postlikes')->select('dislikes')->where('postlikes.post_id', '=', $post->post_id)->where('postlikes.dislikes', '=', 1)->count();
            $post->name = DB::table('users')->select('username')->where('users.user_id', '=', $post->user_id)->first();
            $post->totalcomments = DB::table('comments')->select('description')->where('comments.post_id', '=', $post->post_id)->count();
            $post->totalreplies = DB::table('replycomments')->select('replydescription')->where('replycomments.post_id', '=', $post->post_id)->count();

            $imageFileName = DB::table('posts')->select('imageFile')->where('imageFile', '=', $post->imageFile)->get();

            if ($post->imageFile != '')
                $post->imageFile = url("images/" . $imageFileName[0]->imageFile);
            else
                $post->imageFile = '';

            foreach ($profilepicFileNames as $profilepic) {
                if ($post->user_id == $profilepic->user_id) {
                    $post->postUserpic = url("profilepics/" . $profilepic->ProfilePic);
                    break;
                } else {
                    $post->postUserpic = '';
                }

                if ($profilepic->user_id == $userId) {
                    $loggedInUserProfilePic = url("profilepics/" . $profilepic->ProfilePic);
                    break;
                }
            }
        }

        $allUsersData = DB::table('users')->select('user_id', 'username', 'ProfilePic')->get();
        $profilepicFileNames = DB::table('users')->select('user_id', 'ProfilePic')->where('ProfilePic', '!=', null)->get();
        foreach ($profilepicFileNames as &$profilepic) {
            $profilepic->picFile = url("profilepics/" . $profilepic->ProfilePic);

            foreach ($allUsersData as $user_Id) {
                if ($user_Id->user_id == $profilepic->user_id) {
                    $user_Id->ProfilePic = url("profilepics/" . $profilepic->ProfilePic);
                    $profilepic->username = DB::table('users')->select('username')->where('users.user_id', '=', $user_Id->user_id)->get();
                }
            }
        }

        return [
            'posts' => $allPosts, 'postlikes' => $allPostLikes, 'comments' => $allPostComments,
            'usernames' => $usersName, 'replies' => $replies, 'profilepics' => $profilepicFileNames,
            'loggedUserData' => $loggedInUserData, 'loggedInUserProfilepic' => $loggedInUserProfilePic,
        ];
    }


    // **********************************************************************************************************************************************************************************************
    public function test()
    {
        $allFriendRequestData = DB::table('friends')->get();
        dd($allFriendRequestData);
    }
}
