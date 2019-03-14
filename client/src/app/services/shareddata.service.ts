

export class SharedDataService {

    private loadPost: number;

    constructor(){
       this.loadPost = 5;
    }

    public increaseLoadPostCount(){
        this.loadPost += 5;
        return this.loadPost;
    }

    public getPostLoad(){
        return this.loadPost;
    }

}