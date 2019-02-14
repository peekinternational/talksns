import {share} from 'rxjs/operators';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs';

export class ChatService {

    private url = 'http://localhost:3000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    // ************************ EMITTERS ***********************************

    public sendPost(post) {
        this.socket.emit('new-post', post)
    }

    public sendLike(like) {
        this.socket.emit('new-like', like);
    }

    public sendComment(comment) {
        this.socket.emit('new-comment', comment);
    }

    // ************************ OBSERVERS *********************************

    public getPost = () => {
        return Observable.create(
            (observer) => {
            this.socket.on('new-post', (post) => {
                observer.next(post);
            });
        }).pipe(share());
    }

    public getLikes = () => {
        return Observable.create((observer) => {
            this.socket.on('new-like', (like) => {
                observer.next(like);
            });
        });
    }

    public getComments = () => {
        return Observable.create((observer) => {
            this.socket.on('new-comment', (comment) => {
                observer.next(comment);
            });
        });
    }

} //*** Class Ends */