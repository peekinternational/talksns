import { SessionStorageService } from 'angular-web-storage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendConnector } from '../services/backendconnector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginStatusService } from '../services/loginstatus.service';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../services/deactivateguard.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit, CanComponentDeactivate {

  invalidPassword: boolean = false;
  invalidEmail: boolean = false;

  emailErrorMsg: string = "";
  passwordErrorMsg: string = "";

  // variables used in 'Value' property of input textfields
  emailFieldInputValue: string = "";
  passwordFieldInputValue: string = "";
  message: string = "";

  signinForm: FormGroup;

  constructor(private connectorService: BackendConnector, private loginService: LoginStatusService,
    private router: Router, private formBuilder: FormBuilder, private session: SessionStorageService) { }

  ngOnInit() {
    // if current page is 'signin' then deActivate loginForm in Header
    if (this.router.url === ('/signin')) {
      this.loginService.deActivateLoginForm();
    }
    else { // otherwise activate loginForm in Header
      this.loginService.activateLoginForm();
    }

    // initialize form inputFields values and Validators
    this.signinForm = this.formBuilder.group({
      username_email: [this.loginService.getUserEmail(), [Validators.required]],
      password: [this.loginService.getUserPassword(), Validators.required]
    });

    // check error type and set error message ---------------------------------
    if (this.loginService.getSigninErrorStatus() == "invalidEmail") {
      this.invalidEmail = true; this.invalidPassword = false;
      this.emailErrorMsg = "invalid email/username";
    }
    else if (this.loginService.getSigninErrorStatus() == "invalidPassword") {
      this.invalidPassword = true; this.invalidEmail = false;
      this.passwordErrorMsg = "invalid password";
    }
    else if (this.loginService.getSigninErrorStatus() == "bothInvalid") {
      this.invalidPassword = true; this.invalidEmail = true;
      this.emailErrorMsg = "invalid email/username";
      this.passwordErrorMsg = "invalid password";
    }
    else if (this.loginService.getSigninErrorStatus() == "incorrectData") {
      this.invalidPassword = this.invalidEmail = false;
      this.message = "incorrect email/username or password";
    }
    // ----------------------------------------------------------------------
    
    // store username/email and password to show them in input textFields
    this.emailFieldInputValue = this.loginService.getUserEmail();
    this.passwordFieldInputValue = this.loginService.getUserPassword();
  }

  onLogin() {
    // get and store input fields data
    const email_username = this.signinForm.value.username_email;
    const password = this.signinForm.value.password;

    if (email_username != "" || password != "") { // if required fields are filled

      this.connectorService.signInRequest({'emailORusername':email_username, 'password': password}).then(
        (signInStatusResponse: any) => {
          if (!signInStatusResponse.status) { // if response has 'false' in it, then signIn failed
            this.loginService.setSigninErrorStatus("bothInvalid");
            this.message = "incorrect email/password";
          }
          else{
            this.loginService.setSigninErrorStatus("");
            this.loginService.activateLogin(); // update LoggedIn status
            this.loginService.deActivateLoginForm(); // deActivate loginForm in headers
            this.session.set("email", email_username); // store user data in session service
            this.session.set("authUserId", signInStatusResponse.data.user_id);
            this.loginService.setNextRouteName("landingpage/home");
            this.router.navigate(['landingpage/home']);
          }
        }
      );
    }
  }

  // ****************** SignIn Form Validation Function **********************************
  validateForm(element: HTMLInputElement, elementName: string) {
    this.message = "";

    // Email Validation ------------------------------
    if (elementName == "email") {
      if (element.value != "" && this.signinForm.get('username_email').status == "INVALID") {
        this.invalidEmail = true;
        this.emailErrorMsg = "invalid email address";
      }
      else if (element.value == "") {
        this.invalidEmail = true;
        this.emailErrorMsg = "please enter your email";
      }
      else {
        this.invalidEmail = false;
        this.emailErrorMsg = "";
      }
    }

    // Password Validation ----------------------------
    if (elementName == "password") {
      if (element.value.length == 0) {
        this.invalidPassword = true;
        this.passwordErrorMsg = "please enter password";
      }
      if (element.value.length > 0) {
        this.invalidPassword = false;
        this.passwordErrorMsg = "";
      }
    }
  }// *** Function Ends ***

  removeMessage() {
    setTimeout(() => { this.message = "" }, 2000);
  }

  resetErrorValidations() {
    this.invalidEmail = false;
    this.invalidPassword = false;
    this.loginService.setSigninErrorStatus("");
  }

  // canDeactivate-guard interface function implementation
  // this function executes, when backButton of browser or backSpace button is pressed
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.loginService.isUserLoggedIn()) {
      this.loginService.activateLoginForm();
    }
    else {
      this.loginService.deActivateLoginForm();
    }
    return true;
  }

}
