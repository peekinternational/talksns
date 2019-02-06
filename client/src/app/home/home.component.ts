import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStatusService } from '../services/loginstatus.service';
import { CreatePost } from './createpost.model';
import { PostService } from '../services/postService.service';
import { BackendConnector } from '../services/backendconnector.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './responsivehome.component.css']
})

export class HomeComponent implements OnInit {

  postingFormGroup: FormGroup
  createpost: CreatePost[];

  isPostLiked: boolean = false;
  isPostdisLiked: boolean = false;

  imageSrc: string = "";
  selectedUploadFile: File = null;

  constructor(private route: Router, private loginService: LoginStatusService, private postService: PostService,
    private backendService: BackendConnector, private formbuilder: FormBuilder, private chatService: ChatService) {
  }

  ngOnInit() {

    this.postingFormGroup = this.formbuilder.group({
      'desc': [''],
    });

    this.chatService.getPost().subscribe(
      (newpost: CreatePost[]) => {
        this.createpost = newpost;
      });

    this.postService.addPost.subscribe(
      (post: CreatePost[]) => {
        this.createpost = post;
      }
    );

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
