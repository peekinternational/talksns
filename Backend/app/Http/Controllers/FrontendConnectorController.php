<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class FrontendConnectorController extends Controller
{
    // *******************************************************************************************
    // *********************************** LOGIN - REGISTRATION ***********************************
    // *******************************************************************************************
    public function signUp(Request $request)  // SignUp Response after validation
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
        if (DB::table('users')->where('username', $username)->exists())
            return response()->json(['status' => false, 'message' => "nametaken"]); // send response

        // check if email already registered or not
        if (DB::table('users')->where('email', $email)->exists())
            return response()->json(['status' => false, 'message' => "emailtaken"]); // send response

        // insert user signUp data in database
        $dataInserted = DB::table('users')->insert([
            'username' => $username,
            'email' => $email,
            'gender' => $gender,
            'birthday' => $birthday,
            'password' => $password
        ]);

        // if data inserted, then send 'successful' response to frontend
        if ($dataInserted)
            return response()->json(['status' => true, 'message' => "signup successfull"]);
    } // **** SignUp Function Ends *******

   
    public function signIn(Request $request)  // SignIn Response after validation
    {
       
        // extract signIn data from array-request
        $emailOrusername = $request->emailORusername;
        $password = $request->password; // password

        // get userData from database if email exist
        $user = DB::table('users')->where('email', $emailOrusername)->first();
      
        if ($user == null || $user->length == 0){ // if email not exist then check username
            $user = DB::table('users')->where('username', $emailOrusername)->first();
        }

        if ($user != null) {
            // (if userName OR email matches) AND (Password matches)
            if (($user->email == $emailOrusername || $user->username == $emailOrusername) && $user->password == $password)
                return response()->json(['status' => true, 'data' => $user]);

            // (if userName OR email not matches) OR (Password not matches)
            else if (($user->email != $emailOrusername || $user->username != $emailOrusername) || $user->password != $password)
                return response()->json(['status' => false]);
        } else{  // if userData still doesn't exist in database
            return response()->json(['status' => false]);
        }
    } // ***** SignIn Function Ends *********

    // *******************************************************************************************
    // ***************************************************************************************


    // *******************************************************************************************
    // ***************************** UPLOAD RELATED FUNCTIONS *****************************
    // *******************************************************************************************
    public function uploadPost(Request $request)   // Image Upload
    {
        $userId = $request->userId;
        $item_image = $request->image;
        $description = $request->description;
        $_MaxPostId = (int)$request->maxPostId;
        $status = $request->status;

        $uploadPicture = "";
        if ($item_image != "") {
            $uploadPicture = rand(000000, 999999) . '.' . $item_image->getClientOriginalExtension();
            $destinationPath = public_path('images');
            $item_image->move($destinationPath, $uploadPicture);
        }

        // insert image in database
        $dataInserted = DB::table('posts')->insert([
            'user_id' => $userId,
            'imageFile' => $uploadPicture,
            'description' => $description
        ]);

        if ($dataInserted)
            return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
    }

    public function postLikeDislike(Request $request)  
    {
        $userId = $request->userId;
        $postId = $request->postId;
        $likeStatus = $request->isLiked;
        $dislikeStatus = $request->isDisliked;
        $_MaxPostId = $request->maxPostId;
        $status = $request->status;

        $doesPostExist = DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->first();

        if ($doesPostExist) {  // update post liked status
            DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->update(['likes' => $likeStatus]);
            DB::table('postlikes')->where('user_id', '=', $userId)->where('post_id', '=', $postId)->update(['dislikes' => $dislikeStatus]);

            return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
        } else {
            DB::table('postlikes')->insert([
                'user_id' => $userId,
                'post_id' => $postId,
                'likes' => $likeStatus,
                'dislikes' => $dislikeStatus
            ]);

            return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
        }
    }

    public function comments(Request $request)
    {
        $userId = $request->userId;
        $postId = $request->postId;
        $comment = $request->comment;
        $_MaxPostId = $request->maxPostId;
        $status = $request->status;

        DB::table('comments')->insert([
            'user_id' => $userId,
            'post_id' => $postId,
            'description' => $comment,
        ]);

        return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
    }

    public function replies(Request $request)
    {
        $userId = $request->userId;
        $postId = $request->postId;
        $commentId = $request->commentId;
        $reply = $request->commentReply;
        $_MaxPostId = $request->maxPostId;
        $status = $request->status;

        DB::table('replycomments')->insert([
            'user_id' => $userId,
            'post_id' => $postId,
            'comment_id' => $commentId,
            'replydescription' => $reply,
        ]);

        return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
    }

    public function uploadProfilePic(Request $request)
    {
        $userId = $request->userId;
        $profilepic = $request->profilePic;
        $_MaxPostId = $request->maxPostId;
        $status = $request->status;

        $uploadPicture = "";
        if ($profilepic != "") {
            $uploadPicture = rand(000000, 999999) . '.' . $profilepic->getClientOriginalExtension();
            $destinationPath = public_path('profilepics');
            $profilepic->move($destinationPath, $uploadPicture);
        }

        DB::table('users')->where('user_id', '=', $userId)->update(['ProfilePic' => $uploadPicture]);

        return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
    }

    public function getMaxPostId()
    {
        $maxPostId = DB::table('posts')->max("post_id");
        return response()->json($maxPostId);
    }
    
    public function getCurrentUserMaxPostId(Request $request)
    {
        $userId = $request->userId;
        $maxCurrentUserPostId = DB::table('posts')->where('user_id', '=', $userId)->max("post_id");
        return response()->json($maxCurrentUserPostId);
    }

    // Send Image to FrontEnd's BackendConnector Service
    public function retrievePost(Request $request)
    {
        $userId = $request->userId;
        $_MaxPostId = $request->maxPostId;
        $status = $request->status;
        return response()->json($this->getandSendAllPostData($userId, $_MaxPostId, $status));
    }


    public function getandSendAllPostData($userId, $_MaxPostId, $status)
    {
        $allPosts = null;

        if ($status == "LoadMorePosts") {
            $allPosts = DB::table('posts')->orderBy('post_id', 'desc')->where('post_id', '<', $_MaxPostId)->paginate(5);
        } else if ($status == "timelinePost") {
            $maxPostId1 = DB::table('posts')->max("post_id");
            $allPosts = DB::table('posts')->orderBy('post_id', 'desc')->where('post_id', '<', $maxPostId1 + 1)->paginate(5);

            $countCurrentUserPosts = 0;
            $paginateCount = 10;
            $i = 0;
            while ($countCurrentUserPosts <= 3 && $i < count($allPosts)) {
                if ($allPosts[$i]->user_id == $userId) {
                    $countCurrentUserPosts++;
                } else {
                    $paginateCount++;
                    $allPosts = DB::table('posts')->orderBy('post_id', 'desc')->where('post_id', '<', $maxPostId1 + 1)->paginate($paginateCount);
                }

                $i++;
            }
        } else {
            $maxPostId2 = DB::table('posts')->max("post_id");
            if ($maxPostId2 == 0)
                $allPosts = DB::table('posts')->orderBy('post_id', 'desc')->where('post_id', '<', ($maxPostId2 + 1))->paginate($_MaxPostId);
            else
                $allPosts = DB::table('posts')->orderBy('post_id', 'desc')->where('post_id', '<', ($maxPostId2 + 1))->paginate(5);
        }

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

        $allFriendRequestData = DB::table('friends')->get();
        return [
            'posts' => $allPosts, 'postlikes' => $allPostLikes, 'comments' => $allPostComments,
            'usernames' => $usersName, 'replies' => $replies, 'profilepics' => $profilepicFileNames,
            'loggedUserData' => $loggedInUserData, 'loggedInUserProfilepic' => $loggedInUserProfilePic,
            'allFriendRequest' => $allFriendRequestData, 'currentUser_Id' => $userId
        ];
    }


    //********************************************************************************************************************* */
    //********************************************************************************************************************* */
    //********************************************************************************************************************* */

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
        return response()->json($this->setFriendsData());
    }

    public function friendRequestStatusUpdate(Request $request)
    {
        $userId = $request->userId;
        $senderId = $request->senderId;
        $requestStatus = $request->requestStatus;

        DB::table('friends')->where('sender_id', '=', $senderId)->update(['requeststatus' => $requestStatus]);
        return response()->json($this->setFriendsData());
    }

    public function unfriend(Request $request)
    {
        $userId = $request->userId;
        $friendId = $request->friendUserId;
        $requestStatus = $request->requestStatus;

        DB::table('friends')->where('friend_id', '=', $friendId)->update(['requeststatus' => $requestStatus]);
        return response()->json($this->setFriendsData());
    }

    public function getAddFriendsData(Request $request)
    {
        $userId = $request->userId;
        return response()->json($this->setFriendsData());
    }


    public function setFriendsData()
    {
        $allFriendRequestData = DB::table('friends')->get();
        $profilePicName = DB::table('users')->select('user_id', 'ProfilePic')->where('ProfilePic', '!=', null)->get();
        $allUserdata = DB::table('users')->select('user_id', 'username', 'ProfilePic')->get();

        foreach ($allFriendRequestData as &$friendRequest) {
            $friendRequest->ProfilePic = '';

            foreach ($allUserdata as $user) {
                if ($friendRequest->receiver_id == $user->user_id) {
                    $friendRequest->requestCount = DB::table("friends")->where('receiver_id', '=', $friendRequest->receiver_id)->where("friends.requeststatus", '=', 'sent')->count();
                }
            }
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

    // **********************************************************************************************************************************************************************************************
    public function test()
    { }
}
