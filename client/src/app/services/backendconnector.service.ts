import { ChatService } from './chat.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Subject } from 'rxjs';

@Injectable()
export class BackendConnector {
    //http://127.0.0.1:8000/api/signup
    //http://192.168.100.7:8000/api/signup

    responseStatus: any;
    quickLike = new Subject<any>();

    constructor(private http: HttpClient, private cookie: CookieService, private chatService: ChatService) { }

    // Connect and Send Registration Data to laravel-Backend function
    signUpRequest(signupData: any) {
        var promise = new Promise((resolve, reject) => {
            return this.http.post("http://192.168.100.7:8000/api/signup", signupData).subscribe(
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
            return this.http.post("http://192.168.100.7:8000/api/signin", signinData).subscribe(
                (response: any) => {
                    this.responseStatus = response;
                    resolve(this.responseStatus);
                }
            );
        });
        return promise;
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
                this.chatService.sendPost(response);
            }
        );
    }

    public getPost() {
        return this.http.post("http://192.168.100.7:8000/api/retrievepost", { 'userId': this.cookie.get('authUserId') }).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }

    // ********* LIKES - dISLIKES ***************************************************************
    public setLike(isLiked: boolean, isDisliked: boolean, postId: number) {
        const postLikeData = { 'userId': this.cookie.get('authUserId'), 'postId': postId, 'isLiked': isLiked, 'isDisliked': isDisliked }

        return this.http.post("http://192.168.100.7:8000/api/postlike", postLikeData).subscribe(
            (response: any) => {
                this.chatService.sendPost(response);
            }
        );
    }


    public setCurrentLike(currentPostLike: any) {
        this.quickLike.next(currentPostLike);
    }
}