import { CreatePost } from "../home/createpost.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { ChatService } from "./chat.service";

@Injectable()
export class PostService {

    private createPost: CreatePost[];
    private extractPost = [];

    addPost = new Subject<CreatePost[]>();

    constructor(private chatService: ChatService) {
        this.chatService.getPost().subscribe(
            (newpost: CreatePost[]) => {
                this.createPost = newpost;
            });
    }

    public setAllPosts(allPosts: any) {
        this.createPost = [];

        for (var i = 0; i < allPosts[0].length; i++) {
            if (allPosts[0][i].imageFile == "" || allPosts[0][i].imageFile == null) {

                if (allPosts[2][i] == "" || allPosts[2][i] == null)
                    this.extractPost = [allPosts[0][i].post_id, allPosts[0][i].user_id, "", allPosts[0][i].description, 0, 0, ""];
                else
                    this.extractPost = [allPosts[0][i].post_id, allPosts[0][i].user_id, "", allPosts[0][i].description, allPosts[2][i].likes, allPosts[2][i].dislikes, ""];

                //     this.extractPost = [allPosts[0][i].post_id, allPosts[0][i].user_id, "", allPosts[0][i].description, allPosts[2][i].likes, allPosts[2][i].dislikes, ""];
            }
            else {
                if (allPosts[2][i] == "" || allPosts[2][i] == null)
                    this.extractPost = [allPosts[0][i].post_id, allPosts[0][i].user_id, allPosts[1][i], allPosts[0][i].description, 0, 0, ""];
                else
                    this.extractPost = [allPosts[0][i].post_id, allPosts[0][i].user_id, allPosts[1][i], allPosts[0][i].description, allPosts[2][i].likes, allPosts[2][i].dislikes, ""];
            }

            this.createPost.push(this.extractPost);
        }
        this.addPost.next(this.createPost.slice());
        this.chatService.sendPost(this.createPost.slice());
    }

    public getPost(index: number) {
        return this.createPost[index];
    }

    public getAllPost() {
        return this.createPost.slice();
    }

    public removeAllPosts() {
        this.createPost = [];
    }

    // ---------------------------------------------

    public setAllLikes(allLikes: any) {

        for (var i = 0; i < this.createPost.length; i++) {

            for (var j = 0; j < allLikes.length; j++) {
                if (allLikes[j].post_id == this.createPost[i][0]) {
                    this.createPost[i][4] = allLikes[j].likes;
                    this.createPost[i][5] = allLikes[j].dislikes;
                    break;
                }
                else {
                    this.createPost[i][4] = 0;
                    this.createPost[i][5] = 0;
                }
            }
        }
        this.createPost.reverse();
        this.addPost.next(this.createPost.slice());
        this.chatService.sendPost(this.createPost.slice());
    }

}