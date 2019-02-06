import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class ChatService {

    private url = 'http://localhost:3000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    // ************************ EMITTERS ***********************************

    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }

    public sendPost(post) {
        this.socket.emit('new-post', post)
    }

    public sendLike(like) {
        this.socket.emit('new-like', like);
    }

    // ************************ OBSERVERS *********************************

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }

    public getPost = () => {
        return Observable.create((observer) => {
            this.socket.on('new-post', (post) => {
                observer.next(post);
            });
        });
    }

    public getLikes = () => {
        return Observable.create((observer) => {
            this.socket.on('new-like', (like) => {
                observer.next(like);
            });
        });
    }

} //*** Class Ends */