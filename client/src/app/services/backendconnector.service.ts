import { PostService } from './postService.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { ChatService } from './chat.service';


@Injectable()
export class BackendConnector {

    //http://127.0.0.1:8000/api/signup
    //http://192.168.100.7:8000/api/signup

    responseStatus: any;
    userId = [];
    userData = [];

    constructor (private http: HttpClient, private cookie: CookieService, private postService: PostService,
                 private chatService: ChatService) { }

    // Connect and Send Registration Data to laravel-Backend function
    signUpRequest(signupData: any) {
        return this.http.post("http://192.168.100.7:8000/api/signup", signupData).subscribe(
            (response: any) => {
                this.responseStatus = response; // store response 
            }
        );
    }

    // Connect and Sends SignIn Data to laravel-Backend function
    signInRequest(signinData: any) {
        return this.http.post("http://192.168.100.7:8000/api/signin", signinData).subscribe(
            (response: any) => {
                this.responseStatus = response; // store response
            }
        );
    }

    public uploadPost(imageFile: File, description: string) {
        const fd = new FormData();
        const id = this.cookie.get('authUserId');
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

        return this.http.post("http://192.168.100.7:8000/api/uploadpost", fd).subscribe(
            (response: any) => {
                this.postService.setAllPosts(response);
            }
        );
    }

    public getPost() {
        this.userId[0] = this.cookie.get('authUserId');
        return this.http.post("http://192.168.100.7:8000/api/retrievepost", this.userId).subscribe(
            (response: any) => {
             this.postService.setAllPosts(response);
         
            }
        );
    }

    // ********* LIKES - dISLIKES ***************************************************************
    public setLike(isLiked: boolean, isDisliked: boolean, postId: number) {
        this.userData = [this.cookie.get('authUserId'), postId, isLiked, isDisliked];
        return this.http.post("http://192.168.100.7:8000/api/postlike", this.userData).subscribe(
            (response: any) => {
               this.postService.setAllLikes(response);
            }
        );
    }

    // Response Promise Resolver 
    // (Promise-Handler used in Register, Header and SignIn Components Script)
    resolveBackendResponse() {
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.responseStatus);
            }, 500);
        });
        return promise;
    }
}