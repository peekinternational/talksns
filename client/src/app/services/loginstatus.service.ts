import { Injectable, EventEmitter } from "@angular/core";
import { SessionStorageService } from "angular-web-storage";

@Injectable()
export class LoginStatusService {

    private signInErrorStatus: string = "";
    private userEmail: string = "";
    private userPassword: string = "";
    public nextRouteName: string = "";

    private logInFormActivated: boolean = true;
    private isLoggedIn: boolean = false;

    // Used in 'Header Component' to keep updates, regarding user login and form status
    userLoginStatus = new EventEmitter<boolean>();
    loginFormStatus = new EventEmitter<boolean>();
    

    constructor(private session: SessionStorageService) { 
    }

    // *** Related to loginForm in Header ***********************
    public activateLoginForm() { // Used to Activate loginForm in Header 
        this.logInFormActivated = true;
        this.loginFormStatus.emit(this.logInFormActivated);
    }

    public deActivateLoginForm() { // Used to DeActivate loginForm in Header 
        this.logInFormActivated = false;
        this.loginFormStatus.emit(this.logInFormActivated);
    }

    public getLoginFormActivationStatus() { // Used to get loginForm status value
        return this.logInFormActivated;
    }

    // *** Related to User Logged In Status **********************
    public activateLogin() { // set user logged in status to 'true'
        this.isLoggedIn = true;
        this.userLoginStatus.emit(this.isLoggedIn);
    }

    public deActivateLogin() { // set user logged in status to 'false'
        this.isLoggedIn = false;
        this.userLoginStatus.emit(this.isLoggedIn);
    }

    public isUserLoggedIn() {  // Checks if is user logged in or not using session
        if (this.session.get('email') != null && this.session.get('email') != '') {
            this.activateLogin();
        }
        else {
            this.deActivateLogin();
        }
        return this.isLoggedIn;
    }

    public getuserLogedinStatus() {  // to get the value of loggedIn 
        return this.isLoggedIn;
    }

    // *** Setter and Getter of signInError-name to be used in SignIn-Component *****
    public setSigninErrorStatus(errorName: string) {
        this.signInErrorStatus = errorName;
    }
    public getSigninErrorStatus() {
        return this.signInErrorStatus;
    }

    // *** Setters and Getters of header-component signIn-Form to be used in SignIn-Component *****
    public setUserEmail(data: string) {
        this.userEmail = data;
    }
    public getUserEmail() {
        return this.userEmail;
    }

    public setUserPassword(data: string) {
        this.userPassword = data;
    }
    public getUserPassword() {
        return this.userPassword;
    }

    // to clear header-component signIn-form stored data
    public clearInputData() {
        this.signInErrorStatus = "";
        this.userEmail = "";
        this.userPassword = "";
    }

    public setNextRouteName(nextRoute: string){
        this.nextRouteName = nextRoute;
        localStorage.setItem("routerUrl", this.nextRouteName);
    }

    public getNextRouteName(){
        return this.nextRouteName;
    }

    public removeRouteData(){
        this.nextRouteName = '/';
        localStorage.setItem("routerUrl", this.nextRouteName);
    }
}