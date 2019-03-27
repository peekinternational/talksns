import { share } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class SocketService {

    // private url = 'http://localhost:3000';
    private url = 'http://localhost:3000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    // ************************ EMITTERS ***********************************

    public sendPost(post) {
        this.socket.emit('new-post', post);
    }

    public sendFriendRequest(friendrequest) {
        this.socket.emit('add-friend', friendrequest);
    }

    public sendLikes(likes) {
        this.socket.emit('set-likes', likes);
    }

    public sendComments(comments){
        this.socket.emit('set-comments', comments);
    }

    public sendReplies(replies){
        this.socket.emit('set-replies', replies);
    }

    // ************************ OBSERVERS *********************************
    public getRequest = () => {
        return Observable.create(
            (observer) => {
                this.socket.on('addfriend', (friendrequest) => {
                    observer.next(friendrequest);
                });
            });
    }

    public getPost = () => {
        return Observable.create(
            (observer) => {
                this.socket.on('new-post', (post) => {
                    observer.next(post);
                });
            }).pipe(share());
    }

    public getLikes = () => {
        return Observable.create(
            (observer) => {
                this.socket.on('set-likes', (likes) => {
                    observer.next(likes);
                })
            } 
        )
    }

    public getComments = () => {
        return Observable.create(
            (observer) => {
                this.socket.on('set-comments', (comments) => {
                    observer.next(comments);
                })
            } 
        )
    }

    public getReplies = () => {
        return Observable.create(
            (observer) => {
                this.socket.on('set-replies', (replies) => {
                    observer.next(replies);
                })
            } 
        )
    }

} //*** Class Ends */