import { SocketService } from './socket.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class BackendConnector {

    responseStatus: any;
    quickLike = new Subject<any>();

    constructor(private http: HttpClient, private session: SessionStorageService,
        private chatService: SocketService) { }


    // Connect and Send Registration Data to laravel-Backend function
    signUpRequest(signupData: any) {
        var promise = new Promise((resolve, reject) => {
            return this.http.post("http://localhost:8000/api/signup", signupData).subscribe(
                (response: any) => {
                    this.responseStatus = response;
                    resolve(this.responseStatus);
                }
            );
        });
        return promise;
    }

    // Connect and Sends SignIn Data to laravel-Backend function
    signInRequest(signinData: any) {
        var promise = new Promise((resolve, reject) => {
            return this.http.post("http://localhost:8000/api/signin", signinData).subscribe(
                (response: any) => {
                    this.responseStatus = response;
                    resolve(this.responseStatus);
                }
            );
        });
        return promise;
    }

    //*************************************************************************************/
    //**************************** POSTS  *********************************************************/
    //*************************************************************************************/
    public uploadPost(imageFile: File, description: string, maxPostId: number) {
        const fd = new FormData();
        const id = this.session.get('authUserId');
        var desc = "";

        if (description == "" || description == null)
            desc = "";
        else
            desc = description;

        fd.append('userId', id);

        if (imageFile != null)
            fd.append('image', imageFile, imageFile.name);
        else
            fd.append('image', imageFile, "");

        fd.append('description', desc);
        fd.append('maxPostId', (maxPostId + ''));
        fd.append("status", 'uploadpost');

        return this.http.post("http://localhost:8000/api/uploadpost", fd).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    public uploadProfilePic(imageFile: File) {
        const userid = this.session.get('authUserId');
        const fd = new FormData();

        fd.append('userId', userid);

        if (imageFile != null)
            fd.append('profilePic', imageFile, imageFile.name);
        else
            fd.append('profilePic', imageFile, "");

        return this.http.post("http://localhost:8000/api/profilepic", fd).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    public setLike(isLiked: boolean, isDisliked: boolean, postId: number, maxPostId: number) {
        const postLikeData = { 'userId': this.session.get('authUserId'), 'postId': postId, 'isLiked': isLiked, 'isDisliked': isDisliked, 'maxPostId': maxPostId, "status": 'likes' }

        return this.http.post("http://localhost:8000/api/postlikedislike", postLikeData).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    public setComment(postId: number, comment: string, maxPostId: number) {
        const commentData = { 'userId': this.session.get('authUserId'), 'postId': postId, 'comment': comment, 'maxPostId': maxPostId, "status": 'comment' }

        return this.http.post("http://localhost:8000/api/comment", commentData).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    public setReply(postId: number, commentId: number, commentReply: string, maxPostId: number) {
        const replyData = { 'userId': this.session.get('authUserId'), 'postId': postId, 'commentId': commentId, 'commentReply': commentReply, 'maxPostId': maxPostId, "status": 'reply' }

        return this.http.post("http://localhost:8000/api/reply", replyData).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    // ------------------------- GETTERS ----------------------------------------------------------------
    public getPost(maxPostId: number) {
        return this.http.post("http://localhost:8000/api/retrievepost", { 'userId': this.session.get('authUserId'), 'maxPostId': maxPostId, "status": 'LoadMorePosts' }).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    public getTimelinePost(maxPostId: number) {
        return this.http.post("http://localhost:8000/api/retrievepost", { 'userId': this.session.get('authUserId'), 'maxPostId': maxPostId, "status": 'timelinePost' }).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    public getMaxPostId() {
        var promise = new Promise((resolve, reject) => {
            return this.http.get("http://localhost:8000/api/maxPostId").subscribe(
                (response: any) => {
                    resolve(response);
                }
            );
        });
        return promise;
    }

    public getCurrentUserMaxPostId() {
        var promise = new Promise((resolve, reject) => {
            return this.http.post("http://localhost:8000/api/getUserMaxPostId", { 'userId': this.session.get('authUserId') }).subscribe(
                (response: any) => {
                    resolve(response);
                }
            );
        });
        return promise;
    }

    public setCurrentLike(currentPostLike: any) {
        this.quickLike.next(currentPostLike);
    }

    // **********************************************************************************************************************************************
    // *************************** FRIEND REQUEST **************************************************************************************************
    // ******************************************************************************************************************************************
    public setFriendRequest(receiverId: number, requestStatus: string) {
        const friendRequestData = { 'userId': this.session.get('authUserId'), 'receiverId': receiverId, 'requestStatus': requestStatus }

        return this.http.post("http://localhost:8000/api/setfriendrequest", friendRequestData).subscribe(
            (response: any) => {
                this.chatService.sendFriendRequest(response);
            }
        );
    }

    public FriendRequestUpdate(senderId: number, requestStatus: string) {
        const friendRequestData = { 'userId': this.session.get('authUserId'), 'senderId': senderId, 'requestStatus': requestStatus }
        return this.http.post("http://localhost:8000/api/friendrequestStatus", friendRequestData).subscribe(
            (response: any) => {
                this.chatService.sendFriendRequest(response);
            }
        );
    }

    public UnFriendRequest(friendUserId: number, requestStatus: string) {
        const unfriendRequestData = { 'userId': this.session.get('authUserId'), 'friendUserId': friendUserId, 'requestStatus': requestStatus }
        return this.http.post("http://localhost:8000/api/unfriendrequestStatus", unfriendRequestData).subscribe(
            (response: any) => {
                this.chatService.sendFriendRequest(response);
            }
        );
    }

    public getFriendRequestData() {
        const friendRequestData = { 'userId': this.session.get('authUserId') };

        return this.http.post("http://localhost:8000/api/getAddFriendData", friendRequestData).subscribe(
            (response: any) => {
                this.chatService.sendFriendRequest(response);
            }
        );
    }

}