import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginStatusService } from '../services/loginstatus.service';
import { BackendConnector } from '../services/backendconnector.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  postSubscription: Subscription;
  getPostSubscription: Subscription;

  postingFormGroup: FormGroup
  createpost: any;
  createlike: any;
  createcomments: any;
  createreplies: any;
  usernames: any;
  profilePics: any;
  loggedInUserProfilePic: any = "";

  isPostLiked: boolean = false;
  isPostdisLiked: boolean = false;
  isProfileFound: boolean = false;
 
  userId: number = 0;
  index: number = 0;
  imageSrc: string = "";
  commentValue: string = '';
  replyValue: string = '';
  currentReplyId: number = 0;
  previousReplyId: number = 0;
  show: boolean = false;
  clearView: boolean = false;
  commentReplyStatus: boolean = false;
  replyCommentStatus: boolean = false;
  selectedUploadFile: File = null;

  constructor(private route: Router, private loginService: LoginStatusService, private cookie: CookieService,
    private backendService: BackendConnector, private formbuilder: FormBuilder, private chatService: ChatService) {
    }

  ngOnInit() {
    this.userId = parseInt(this.cookie.get('authUserId'));
    localStorage.setItem('routerUrl', '/landingpage/home');

    this.postingFormGroup = this.formbuilder.group({
      'desc': [''],
    });

    this.getPostSubscription = this.chatService.getPost().subscribe(
      (newpost: any) => {
        this.createpost = newpost.posts;
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
          if (this.createlike[i].user_id == this.cookie.get('authUserId') && postLikeData.postId == this.createlike[i].post_id) {

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

      this.backendService.getPost();
      this.backendService.getFriendRequestData();
  } // *** OnInit Ends *************

  public addMyPost(desc: string) {
    this.backendService.uploadPost(this.selectedUploadFile, desc);
    this.imageSrc = "";
    this.selectedUploadFile = null;
    this.postingFormGroup.reset();
  }

  onImageUpload(event) {
    //if (this.selectedUploadFile == null) {
    this.selectedUploadFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;
      reader.readAsDataURL(file);
    }
    //}
  }

  onPostLike(postId: number, isLiked: number) {
    this.isPostLiked = !(isLiked);
    this.backendService.setCurrentLike({ 'postId': postId, 'LikedStatus': this.isPostLiked, 'dislikedStatus': false });
    this.backendService.setLike(this.isPostLiked, false, postId);
  }

  onPostdisLike(postId: number, isDisliked: number) {
    this.isPostdisLiked = !(isDisliked);
    this.backendService.setCurrentLike({ 'postId': postId, 'dislikedStatus': this.isPostdisLiked, 'likedStatus': false });
    this.backendService.setLike(false, this.isPostdisLiked, postId);
  }

  resetShow() {
    this.show = false;
  }
  check() {
    this.show = true;
  }

  MainComment(event, postId: number, textArea: HTMLInputElement) {
    if (event.keyCode == 13) {
      this.backendService.setComment(postId, textArea.value);
      this.commentValue = "";
      this.commentReplyStatus = false;
      this.replyCommentStatus = false;
      textArea.placeholder = "Post your comment";
    }
  }

  ReplyComment(event, postId: number, commentId: number, textArea: HTMLInputElement) {

    if (event.keyCode == 13) {
      this.backendService.setReply(postId, commentId, textArea.value);
      this.replyValue = "";
      this.replyCommentStatus = false;
      this.commentReplyStatus = false;
      textArea.placeholder = "Post your comment";
    }
  }

  showCommentReply(commentId: number) {

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

  ProfilePicFound() {
    this.isProfileFound = true;
  }
  ProfilePicNotFound() {
    this.isProfileFound = false;
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

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
    this.getPostSubscription.unsubscribe();
  }
}
