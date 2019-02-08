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
  setPostData = [];

  isPostLiked: boolean = false;
  isPostdisLiked: boolean = false;

  imageSrc: string = "";
  selectedUploadFile: File = null;

  constructor(private route: Router, private loginService: LoginStatusService, private cookie: CookieService,
    private backendService: BackendConnector, private formbuilder: FormBuilder, private chatService: ChatService) { }

  ngOnInit() {

    this.postingFormGroup = this.formbuilder.group({
      'desc': [''],
    });

    this.chatService.getPost().subscribe(
      (newpost: any) => {
        this.createpost = newpost;
        //console.log (this.createpost);
       // this.setAllPostData(newpost);
      });

    this.backendService.addLike.subscribe(
      (likesDisLikes: any) => {
        this.setAllLikes(likesDisLikes);
      });

    this.backendService.getPost();

  } // *** OnInit Ends *************

  // public setAllPostData(createdpost: any) {
  //   this.createpost = [];
  
  //   for (var i = 0; i < createdpost.posts.length; i++) {
  //     if (createdpost.posts[i].imageFile == "" || createdpost.posts[i].imageFile == null) {
  //       this.setPostData = [createdpost.posts[i].post_id, createdpost.posts[i].user_id, "", createdpost.posts[i].description, 0, 0, ""];
  //     }
  //     else {
  //       this.setPostData = [createdpost.posts[i].post_id, createdpost.posts[i].user_id, createdpost.imageFiles[i], createdpost.posts[i].description, 0, 0, ""];
  //     }

  //     this.createpost.push(this.setPostData.slice());

  //     for (var j = 0; j < createdpost.postlikes.length; j++) {
  //       if (createdpost.postlikes[j].user_id == this.cookie.get('authUserId') && createdpost.postlikes[j].post_id == this.createpost[i][0]) {
  //         this.createpost[i][4] = createdpost.postlikes[j].likes;
  //         this.createpost[i][5] = createdpost.postlikes[j].dislikes;
  //         break;
  //       }
  //     }
  //   }
  // }

  public setAllLikes(allLikes: any) {
    for (var i = 0; i < this.createpost.length; i++) {

      for (var j = 0; j < allLikes.length; j++) {

        if (allLikes[j].user_id == this.cookie.get('authUserId')) {

          if (allLikes[j].post_id == this.createpost[i][0]) {
            this.createpost[i][4] = allLikes[j].likes;
            this.createpost[i][5] = allLikes[j].dislikes;
            break;
          }
        }
      }
    }
  }

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
    this.backendService.setLike(this.isPostLiked, false, postId);
  }

  onPostdisLike(postId: number, isDisliked: number) {
    this.isPostdisLiked = !(isDisliked);
    this.backendService.setLike(false, this.isPostdisLiked, postId);
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
