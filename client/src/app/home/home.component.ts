import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStatusService } from '../services/loginstatus.service';
import { BackendConnector } from '../services/backendconnector.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './responsivehome.component.css']
})

export class HomeComponent implements OnInit {

  postingFormGroup: FormGroup
  createpost: any;
  createlike: any;
  //setPostData = [];

  isPostLiked: boolean = false;
  isPostdisLiked: boolean = false;

  userId: number = 0;
  imageSrc: string = "";
  show: boolean = false;
  selectedUploadFile: File = null;

  constructor(private route: Router, private loginService: LoginStatusService, private cookie: CookieService,
    private backendService: BackendConnector, private formbuilder: FormBuilder, private chatService: ChatService) { }

  ngOnInit() {
    this.userId = parseInt(this.cookie.get('authUserId'));

    this.postingFormGroup = this.formbuilder.group({
      'desc': [''],
    });

    this.chatService.getPost().subscribe(
      (newpost: any) => {
        this.createpost = newpost.posts;
        this.createlike = newpost.postlikes;
      });

    this.backendService.quickLike.subscribe(
      (postLikeData: any) => {
        for (var i = 0; i < this.createlike.length; i++) {
          if (this.createlike[i].user_id == this.cookie.get('authUserId') && postLikeData.postId == this.createlike[i].post_id){
            this.createlike[i].likes = postLikeData.LikedStatus;
            this.createlike[i].dislikes = postLikeData.dislikedStatus;
            break;
          }
        }
      });

    this.backendService.getPost();

  } // *** OnInit Ends *************

  public addMyPost(desc: string) {
    this.backendService.uploadPost(this.selectedUploadFile, desc);
    this.imageSrc = "";
    this.selectedUploadFile = null;
    this.postingFormGroup.reset();
  }

  onImageUpload(event) {
    if (this.selectedUploadFile == null) {
      this.selectedUploadFile = <File>event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result as string;
        reader.readAsDataURL(file);
      }
    }
  }

  onPostLike(postId: number, isLiked: number) {
    this.isPostLiked = !(isLiked);
    this.backendService.setCurrentLike({ 'postId': postId, 'LikedStatus': this.isPostLiked, 'dislikedStatus': false});
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.loginService.getuserLogedinStatus()) {
      return true;
    }
    else {
      this.route.navigate(['/home']); return false;
    }
  }
}
