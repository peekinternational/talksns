import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginStatusService } from '../../services/loginstatus.service';
import { BackendConnector } from '../../services/backendconnector.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  // postSubscription: Subscription;
  getPostSubscription: Subscription;
  getLikeSubscription: Subscription;
  getCommentSubscription: Subscription;
  getReplySubscription: Subscription;

  postingFormGroup: FormGroup;

  createpost: any;
  previousPosts = [];
  maxPostsId = 0;
  userActionStatus: string = '';

  // totalLikes: number = 0;  totaldisLikes: number = 0;
  totalComments: number = 0; totalReplies: number = 0;
  createlike: any;
  createcomments: any;
  createreplies: any;
  usernames: any;
  profilePics: any;
  loggedInUserProfilePic: any = "";
  allFriendsRequest: any = "";
  postLikesDislikes: any;

  isPostLiked: boolean = false;
  isPostdisLiked: boolean = false;
  isProfileFound: boolean = false;
  isPostFound: boolean = false;
  isCommentFound: boolean = false;
  isLikeFound: boolean = false; isdisLikeFound: boolean = false;
  isTotalLikedFound: boolean = false; isTotaldisLikedFound: boolean = false;
  isReplyFound: boolean = false;

  userId: number = 0;
  imageSrc: string = "";
  commentValue: string = '';
  replyValue: string = '';
  currentReplyId: number = 0;
  previousReplyId: number = 0;
  //newPostUploaded: boolean;
  commentReplyStatus: boolean = false;
  replyCommentStatus: boolean = false;
  selectedUploadFile: File = null;

  constructor(private route: Router, private loginService: LoginStatusService, public session: SessionStorageService,
    private backendService: BackendConnector, private formbuilder: FormBuilder, private socketService: SocketService) {
  }

  ngOnInit() {
    this.userId = parseInt(this.session.get('authUserId'));
    localStorage.setItem('routerUrl', '/landingpage/home');

    this.postingFormGroup = this.formbuilder.group({
      'desc': [''],
    });

    this.getPostSubscription = this.socketService.getPost().subscribe(
      (newpost: any) => {
        //console.log(newpost);
        if ((this.userActionStatus == 'loadmore') && newpost.currentUser_Id == this.session.get('authUserId')) {
          // console.log(newpost.currentUser_Id +" B== "+ this.session.get('authUserId'));
          this.createpost = this.previousPosts.concat(newpost.posts.data);
          this.previousPosts = this.previousPosts.concat(newpost.posts.data);
        }

        else {   //*********** recheck needed */
          if (newpost.currentUser_Id == this.session.get('authUserId')) {
            // console.log(newpost.currentUser_Id +" A== "+ this.session.get('authUserId'));
            this.createpost = newpost.posts.data;
            this.previousPosts = newpost.posts.data;
          }

          if (newpost.status == "uploadpost") {
            this.createpost = newpost.posts.data;
            this.previousPosts = newpost.posts.data;
          }
        }

        this.usernames = newpost.usernames;
        this.profilePics = newpost.profilepics;
        this.loggedInUserProfilePic = newpost.loggedInUserProfilepic;
        this.allFriendsRequest = newpost.allFriendRequest;
      });

    this.backendService.getLike();
    this.getLikeSubscription = this.socketService.getLikes().subscribe(
      (likes: any) => {
        //console.log(likes);
        this.postLikesDislikes = likes.postTotalLikes;
        this.createlike = likes.likedDisliked;
      }
    );

    this.backendService.getComment();
    this.getCommentSubscription = this.socketService.getComments().subscribe(
      (postcomments: any) => {
        //  console.log(postcomments);
        this.totalComments = postcomments.totalComments;
        this.createcomments = postcomments.comments;
      }
    );

    this.backendService.getReply();
    this.getReplySubscription = this.socketService.getReplies().subscribe(
      (postreplies: any) => {
        //  console.log(postreplies);
        this.totalReplies = postreplies.totalReplies;
        this.createreplies = postreplies.replies;
      }
    );

    // this.postSubscription = this.backendService.quickLike.subscribe(
    //   (postLikeData: any) => {
    //     for (var i = 0; i < this.createlike.length; i++) {
    //       if (this.createlike[i].user_id == this.session.get('authUserId') && postLikeData.postId == this.createlike[i].post_id) {

    //         for (var j = 0; j < this.createpost.length; j++) {

    //           if (this.createpost[j].post_id == postLikeData.postId) {

    //             if ((!this.createlike[i].likes && !this.createlike[i].dislikes) && (postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
    //               this.createpost[j].totalLiked += 1; break;
    //             }
    //             else if ((!this.createlike[i].likes && !this.createlike[i].dislikes) && (!postLikeData.LikedStatus && postLikeData.dislikedStatus)) {
    //               this.createpost[j].totaldisLiked += 1; break;
    //             }
    //             //********* */
    //             else if ((this.createlike[i].likes && !this.createlike[i].dislikes) && (!postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
    //               this.createpost[j].totalLiked -= 1;
    //               if (this.createpost[j].totalLiked <= 0)
    //                 this.createpost[j].totalLiked = 0;
    //               break;
    //             }
    //             else if ((this.createlike[i].likes && !this.createlike[i].dislikes) && (postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
    //               this.createpost[j].totalLiked -= 1;
    //               if (this.createpost[j].totalLiked <= 0)
    //                 this.createpost[j].totalLiked = 0;
    //               break;
    //             }
    //             else if ((this.createlike[i].likes && !this.createlike[i].dislikes) && (!postLikeData.LikedStatus && postLikeData.dislikedStatus)) {
    //               this.createpost[j].totalLiked -= 1;
    //               this.createpost[j].totaldisLiked += 1;
    //               if (this.createpost[j].totalLiked <= 0)
    //                 this.createpost[j].totalLiked = 0;
    //               break;
    //             }
    //             //********* */
    //             else if ((!this.createlike[i].likes && this.createlike[i].dislikes) && (!postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
    //               this.createpost[j].totaldisLiked -= 1;
    //               if (this.createpost[j].totaldisLiked <= 0)
    //                 this.createpost[j].totaldisLiked = 0;
    //               break;
    //             }
    //             else if ((!this.createlike[i].likes && this.createlike[i].dislikes) && (!postLikeData.LikedStatus && postLikeData.dislikedStatus)) {
    //               this.createpost[j].totaldisLiked -= 1;
    //               if (this.createpost[j].totaldisLiked <= 0)
    //                 this.createpost[j].totaldisLiked = 0;
    //               break;
    //             }
    //             else if ((!this.createlike[i].likes && this.createlike[i].dislikes) && (postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
    //               this.createpost[j].totalLiked += 1;
    //               this.createpost[j].totaldisLiked -= 1;
    //               if (this.createpost[j].totaldisLiked <= 0)
    //                 this.createpost[j].totaldisLiked = 0;
    //               break;
    //             }
    //           }
    //         }

    //         this.createlike[i].likes = postLikeData.LikedStatus;
    //         this.createlike[i].dislikes = postLikeData.dislikedStatus;

    //         break;
    //       }
    //     }
    //   });

    this.backendService.getMaxPostId().then(
      (maxPostId: any) => {
        this.maxPostsId = maxPostId + 1;
        this.backendService.getPost(this.maxPostsId);
      }
    );

  } // *** OnInit Ends *************

  public addMyPost(desc: string) {
    //this.newPostUploaded = true;
    this.userActionStatus = '';
    this.backendService.uploadPost(this.selectedUploadFile, desc, this.previousPosts.length);
    this.imageSrc = "";
    this.selectedUploadFile = null;
    this.postingFormGroup.reset();
  }

  onImageUpload(event) {
    this.userActionStatus = '';
    this.selectedUploadFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onPostLike(postId: number, isLiked: number) {
    this.userActionStatus = '';
    // console.log(isLiked);
    this.isPostLiked = !(isLiked);
    // console.log(this.isPostLiked);
    //this.backendService.setCurrentLike({ 'postId': postId, 'LikedStatus': this.isPostLiked, 'dislikedStatus': false });
    this.backendService.setLike(this.isPostLiked, false, postId, this.previousPosts.length);
  }

  onPostdisLike(postId: number, isDisliked: number) {
    this.userActionStatus = '';
    this.isPostdisLiked = !(isDisliked);
    // this.backendService.setCurrentLike({ 'postId': postId, 'dislikedStatus': this.isPostdisLiked, 'likedStatus': false });
    this.backendService.setLike(false, this.isPostdisLiked, postId, this.previousPosts.length);
  }

  totaldisLikedFound() {
    this.isTotaldisLikedFound = true;
  }
  totaldisLikednotFound() {
    this.isTotaldisLikedFound = false;
  }

  totalLikedFound() {
    this.isTotalLikedFound = true;
  }
  totalLikednotFound() {
    this.isTotalLikedFound = false;
  }

  commentFound() {
    this.isCommentFound = true;
  }
  commentNotFound() {
    this.isCommentFound = false;
  }

  LikeFound() {
    this.isLikeFound = true;
  }
  LikeNotFound() {
    this.isLikeFound = false;
  }

  disLikeFound() {
    this.isdisLikeFound = true;
  }
  disLikeNotFound() {
    this.isdisLikeFound = false;
  }

  replyFound() {
    this.isReplyFound = true;
  }
  replyNotFound() {
    this.isReplyFound = false;
  }

  MainComment(event, postId: number, textArea: HTMLInputElement) {
    this.userActionStatus = '';
    if (event.keyCode == 13) {
      this.backendService.setComment(postId, textArea.value, this.previousPosts.length);
      this.commentValue = "";
      this.commentReplyStatus = false;
      this.replyCommentStatus = false;
      textArea.placeholder = "Post your comment";
    }
  }

  ReplyComment(event, postId: number, commentId: number, textArea: HTMLInputElement) {
    this.userActionStatus = '';
    if (event.keyCode == 13) {
      this.backendService.setReply(postId, commentId, textArea.value, this.previousPosts.length);
      this.replyValue = "";
      this.replyCommentStatus = false;
      this.commentReplyStatus = false;
      textArea.placeholder = "Post your comment";
    }
  }

  showCommentReply(commentId: number) {
    this.userActionStatus = '';
    this.replyValue = "";
    this.commentReplyStatus = !this.commentReplyStatus;

    if (this.commentReplyStatus)
      this.replyCommentStatus = false;

    if (this.previousReplyId == commentId) {
      this.currentReplyId = this.previousReplyId;
    }
    else {
      this.currentReplyId = commentId;
      this.previousReplyId = this.currentReplyId;

      if (!this.commentReplyStatus) {
        this.commentReplyStatus = true;
      }
    }
  }

  showReplyComment(userId: string, replyId: number) {
    this.userActionStatus = '';
    for (var name of this.usernames) {
      if (name.user_id == userId)
        this.replyValue = "@" + name.username;
    }

    this.replyCommentStatus = !this.replyCommentStatus;

    if (this.replyCommentStatus)
      this.commentReplyStatus = false;

    if (this.previousReplyId == replyId) {
      this.currentReplyId = this.previousReplyId;
    }
    else {
      this.currentReplyId = replyId;
      this.previousReplyId = this.currentReplyId;

      if (!this.replyCommentStatus) {
        this.replyCommentStatus = true;
      }
    }
  }
  trackByFn(index, item) {
    //console.log(item.post_id);
    return item.post_id; // or item.post_id
  }

  // postTrackByFn(index, item) {
  //   return item.post_id;
  // }

  // picTrackByFn(index, item) {
  //   return item.user_id;
  // }

  // likeTrackByFn(index, item) {
  //   return item.likes_id;
  // }

  // commentTrackByFn(index, item) {
  //   return item.comment_id;
  // }

  // replyTrackByFn(index, item) {
  //   return item.reply_id;
  // }

  // nameTrackByFn(index, item) {
  //   return item.user_id;
  // }


  LoadMorePost(maxPostId: number) {
    this.userActionStatus = 'loadmore';
    this.backendService.getPost(maxPostId);
  }

  ProfilePicFound() {
    this.isProfileFound = true;
  }
  ProfilePicNotFound() {
    this.isProfileFound = false;
  }

  friendsPostFound() {
    this.isPostFound = true;
  }

  friendsPostNotFound() {
    this.isPostFound = false;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.getNextRouteName() != "")
      return true;
    if (!this.loginService.getuserLogedinStatus())
      return true;
    else {
      this.route.navigate(['landingpage/home']);
      return false;
    }
  }

  ngOnDestroy() {
    //this.postSubscription.unsubscribe();
    this.getPostSubscription.unsubscribe();
    this.getCommentSubscription.unsubscribe();
    this.getReplySubscription.unsubscribe();
    this.getLikeSubscription.unsubscribe();
  }
}
