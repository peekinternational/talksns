import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginStatusService } from 'src/app/services/loginstatus.service';
import { BackendConnector } from 'src/app/services/backendconnector.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';
import { SharedDataService } from 'src/app/services/shareddata.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {

  postSubscription: Subscription;
  getPostSubscription: Subscription;
  addFriendSubscription: Subscription;

  postingFormGroup: FormGroup;
  createpost: any;
  createlike: any;
  createcomments: any;
  createreplies: any;
  usernames: any;
  allUserdata: any;
  allFriendsRequest: any;
  profilePics: any;
  loggedInUserProfilePic: any = "";
  userActionStatus: string = '';
  previousPosts = [];

  isPostLiked: boolean = false;
  isPostdisLiked: boolean = false;
  isProfileFound: boolean = false;
  activatedTab: string = 'timeline';

  maxPostsId = 0;
  totalPostsToLoad: number;
  userId: number = 0;
  imageSrc: string = "";
  profilePicSrc: string = "";
  commentValue: string = '';
  replyValue: string = '';
  currentReplyId: number = 0;
  previousReplyId: number = 0;
  show: boolean = false;
  clearView: boolean = false;
  commentReplyStatus: boolean = false;
  replyCommentStatus: boolean = false;
  selectedUploadFile: File = null;
  setUserProfilePic: any;

  constructor(public session: SessionStorageService, private backendService: BackendConnector,
    private formbuilder: FormBuilder, private chatService: ChatService,
    private sharedService: SharedDataService) {

    this.totalPostsToLoad = this.sharedService.getPostLoad();
  }

  ngOnInit() {

    this.userId = parseInt(this.session.get('authUserId'));

    this.postingFormGroup = this.formbuilder.group({
      'desc': [''],
    });

    this.addFriendSubscription = this.chatService.getRequest().subscribe(
      (friendsData: any) => {
        this.allFriendsRequest = friendsData.allFriendRequests;
        this.allUserdata = friendsData.allUserdata;
      });

    this.getPostSubscription = this.chatService.getPost().subscribe(
      (newpost: any) => {
        if (this.userActionStatus == 'loadmore' && newpost.currentUser_Id == this.session.get('authUserId')) {
          this.createpost = this.previousPosts.concat(newpost.posts.data);
          this.previousPosts = this.previousPosts.concat(newpost.posts.data);
        }
        else {
          if (newpost.currentUser_Id == this.session.get('authUserId')) {
            this.createpost = newpost.posts.data;
            this.previousPosts = newpost.posts.data;
          }
        }

        this.createlike = newpost.postlikes;
        this.createcomments = newpost.comments;
        this.usernames = newpost.usernames;
        this.createreplies = newpost.replies;
        this.profilePics = newpost.profilepics;
        this.loggedInUserProfilePic = newpost.loggedInUserProfilepic;
      });

    this.postSubscription = this.backendService.quickLike.subscribe(
      (postLikeData: any) => {
        for (var i = 0; i < this.createlike.length; i++) {
          if (this.createlike[i].user_id == this.session.get('authUserId') && postLikeData.postId == this.createlike[i].post_id) {

            for (var j = 0; j < this.createpost.length; j++) {

              if (this.createpost[j].post_id == postLikeData.postId) {

                if ((!this.createlike[i].likes && !this.createlike[i].dislikes) && (postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
                  this.createpost[j].totalLiked += 1; break;
                }
                else if ((!this.createlike[i].likes && !this.createlike[i].dislikes) && (!postLikeData.LikedStatus && postLikeData.dislikedStatus)) {
                  this.createpost[j].totaldisLiked += 1; break;
                }
                //********* */
                else if ((this.createlike[i].likes && !this.createlike[i].dislikes) && (!postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
                  this.createpost[j].totalLiked -= 1;
                  if (this.createpost[j].totalLiked <= 0)
                    this.createpost[j].totalLiked = 0;
                  break;
                }
                else if ((this.createlike[i].likes && !this.createlike[i].dislikes) && (postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
                  this.createpost[j].totalLiked -= 1;
                  if (this.createpost[j].totalLiked <= 0)
                    this.createpost[j].totalLiked = 0;
                  break;
                }
                else if ((this.createlike[i].likes && !this.createlike[i].dislikes) && (!postLikeData.LikedStatus && postLikeData.dislikedStatus)) {
                  this.createpost[j].totalLiked -= 1;
                  this.createpost[j].totaldisLiked += 1;
                  if (this.createpost[j].totalLiked <= 0)
                    this.createpost[j].totalLiked = 0;
                  break;
                }
                //********* */
                else if ((!this.createlike[i].likes && this.createlike[i].dislikes) && (!postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
                  this.createpost[j].totaldisLiked -= 1;
                  if (this.createpost[j].totaldisLiked <= 0)
                    this.createpost[j].totaldisLiked = 0;
                  break;
                }
                else if ((!this.createlike[i].likes && this.createlike[i].dislikes) && (!postLikeData.LikedStatus && postLikeData.dislikedStatus)) {
                  this.createpost[j].totaldisLiked -= 1;
                  if (this.createpost[j].totaldisLiked <= 0)
                    this.createpost[j].totaldisLiked = 0;
                  break;
                }
                else if ((!this.createlike[i].likes && this.createlike[i].dislikes) && (postLikeData.LikedStatus && !postLikeData.dislikedStatus)) {
                  this.createpost[j].totalLiked += 1;
                  this.createpost[j].totaldisLiked -= 1;
                  if (this.createpost[j].totaldisLiked <= 0)
                    this.createpost[j].totaldisLiked = 0;
                  break;
                }
              }
            }

            this.createlike[i].likes = postLikeData.LikedStatus;
            this.createlike[i].dislikes = postLikeData.dislikedStatus;

            break;
          }
        }
      });
    this.backendService.getFriendRequestData();

    this.backendService.getCurrentUserMaxPostId().then(
      (maxPostId: any) => {
        this.maxPostsId = maxPostId + 1;
        this.backendService.getTimelinePost(this.maxPostsId);
      }
    );

  }

  public addMyPost(desc: string) {
    this.userActionStatus = '';
    this.backendService.uploadPost(this.selectedUploadFile, desc, this.previousPosts.length);
    this.imageSrc = "";
    this.selectedUploadFile = null;
    this.postingFormGroup.reset();
  }

  onImageUpload(event) {
    // if (this.selectedUploadFile == null) {
    this.selectedUploadFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;
      reader.readAsDataURL(file);
    }
    // }
  }

  onProfilePicUpload(event) {
    const profileUploadedFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.profilePicSrc = reader.result as string;
      reader.readAsDataURL(file);
    }

    this.backendService.uploadProfilePic(profileUploadedFile);
  }


  onPostLike(postId: number, isLiked: number) {
    this.userActionStatus = '';
    this.isPostLiked = !(isLiked);
    this.backendService.setCurrentLike({ 'postId': postId, 'LikedStatus': this.isPostLiked, 'dislikedStatus': false });
    this.backendService.setLike(this.isPostLiked, false, postId, this.previousPosts.length);
  }

  onPostdisLike(postId: number, isDisliked: number) {
    this.userActionStatus = '';
    this.isPostdisLiked = !(isDisliked);
    this.backendService.setCurrentLike({ 'postId': postId, 'dislikedStatus': this.isPostdisLiked, 'likedStatus': false });
    this.backendService.setLike(false, this.isPostdisLiked, postId, this.previousPosts.length);
  }

  resetShow() {
    this.show = false;
  }
  check() {
    this.show = true;
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

  activateSelectedTab(tabname: string) {
    this.activatedTab = tabname;
  }

  unfriend(friendId: number) {
    this.backendService.UnFriendRequest(friendId, 'reject');
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.getPostSubscription.unsubscribe();
    this.addFriendSubscription.unsubscribe();
  }
}
