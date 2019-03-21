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

} //*** Class Ends */