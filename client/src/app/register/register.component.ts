import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendConnector } from '../services/backendconnector.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { LoginStatusService } from '../services/loginstatus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy {

  loginSubscription: Subscription;

  //-- Birthday Variables -------------------------------------------------------------------------
  currentYear: number = 2019;
  minimumYear: number = 1920;

  dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
  years = [];
  //-----------------------------------------------------------------------------------------------
  signinForm: FormGroup;
  signupForm: FormGroup;
  // Form input-fields validation variables
  nameValidationStatus: boolean = false;
  nameInputFieldError: boolean = false;

  emailValidationStatus: boolean = false;
  emailInputFieldError: boolean = false;

  genderValidationStatus: boolean = false;
  birthdayValidationStatus: boolean = false;
  passwordValidationStatus: boolean = false;
  passwordMatchStatus: boolean = false;

  activatedForm: string = "regform";
  usernameErrorMsg: string = "";
  emailErrorMsg: string = "";
  message: string = "";
  passwordErrorMsg: string = "";

  passwordField: HTMLInputElement;

  breakLineStatus: boolean = false;
  invalidPassword: boolean = false;
  invalidEmail: boolean = false;

  // variables used in 'Value' property of input textfields
  emailFieldInputValue: string = "";
  passwordFieldInputValue: string = "";

  constructor(private formBuilder: FormBuilder, private connectorService: BackendConnector,
    private router: Router, public session: SessionStorageService,
    private loginService: LoginStatusService) {

    // calculate years and store it in array
    for (var i = this.minimumYear; i < this.currentYear; i++) {
      this.minimumYear++;
      this.years.push(this.minimumYear);
    }

    // initialize form values and validators
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.minLength(3), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['male', [Validators.required]],
      date: ['', [Validators.required]],
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      password: ['', [Validators.minLength(5), Validators.required]],
      confirmpassword: ['', [Validators.required]]
    });
  } //---- Constructor Ends --------------------------------------

  ngOnInit() {
    this.loginSubscription = this.loginService.updateActivatedForm.subscribe(
      (getActivatedForm: string) => {
        this.activatedForm = getActivatedForm;
        this.message = "";
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
      }
    );

    // initialize form inputFields values and Validators
    this.signinForm = this.formBuilder.group({
      username_email: [this.loginService.getUserEmail(), [Validators.required]],
      password: [this.loginService.getUserPassword(), Validators.required]
    });
    // ----------------------------------------------------------------------

    // store username/email and password to show them in input textFields
    this.emailFieldInputValue = this.loginService.getUserEmail();
    this.passwordFieldInputValue = this.loginService.getUserPassword();
  }

  onSignUp() {
    // Gender Validation (If gender option is not selected by default)
    if (this.signupForm.value.gender == "gender") {
      if (this.signupForm.value.gender != null)
        this.genderValidationStatus = true;
      else
        this.genderValidationStatus = false;
    }

    // Birthday Validation
    if (this.signupForm.value.date == "" || this.signupForm.value.month == "" || this.signupForm.value.year == "")
      this.birthdayValidationStatus = true;
    else
      this.birthdayValidationStatus = false;

    // Storing User's Register Information in an object
    const signUpdata = {
      'username': this.signupForm.value.username,
      'email': this.signupForm.value.email,
      'gender': this.signupForm.value.gender,
      'date': this.signupForm.value.date,
      'month': this.signupForm.value.month,
      'year': this.signupForm.value.year,
      'password': this.signupForm.value.password,
    };

    this.connectorService.signUpRequest(signUpdata).then(
      (responseStatus: any) => {
        if (!responseStatus.status) { // if response is false
          if (responseStatus.message == "nametaken") {
            this.nameValidationStatus = this.nameInputFieldError = true;
            this.usernameErrorMsg = "name already taken";
          }
          if (responseStatus.message == "emailtaken") {
            this.emailValidationStatus = this.emailInputFieldError = true;
            this.emailErrorMsg = "email already taken";
          }
        }
        else { // if response is true
          this.message = "signin successfull";
          this.router.navigate(['/signin']);
          this.removeMsg();
        }
      });
  }

  onLogin() {
    // get and store input fields data
    const email_username = this.signinForm.value.username_email;
    const password = this.signinForm.value.password;

    if (email_username != "" || password != "") { // if required fields are filled

      this.connectorService.signInRequest({ 'emailORusername': email_username, 'password': password }).then(
        (signInStatusResponse: any) => {
          if (!signInStatusResponse.status) { // if response has 'false' in it, then signIn failed
            this.loginService.setSigninErrorStatus("bothInvalid");
            this.message = "incorrect email/password";
          }
          else {
            this.loginService.setSigninErrorStatus("");
            this.loginService.userLoggedIn(); // update LoggedIn status
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

  // ****************** SignUp Form Validation Function **********************************
  validateForm(element: HTMLInputElement, elementName: string) {

    // Username Validation ---------------------------
    if (elementName == "name") {
      this.nameInputFieldError = false;
      if (element.value.length > 0 && element.value.length < 3) {
        this.usernameErrorMsg = "name must be atleast 3 characters"
        this.nameValidationStatus = true;
      }
      else {
        this.usernameErrorMsg = "";
        this.nameValidationStatus = false;
      }
    }

    // Email Validation ------------------------------
    if (elementName == "email") {
      this.emailInputFieldError = false;
      if (element.value != "" && this.signupForm.get('email').status == "INVALID") {
        this.emailErrorMsg = "invalid email address";
        this.emailValidationStatus = true;
      }
      else {
        this.emailErrorMsg = "";
        this.emailValidationStatus = false;
      }

    }

    // Birthday Validation ------------------------------
    if (elementName == "date") {
      if (element.value != "" && (this.signupForm.value.month == "" || this.signupForm.value.year == "")) {
        this.birthdayValidationStatus = true;
      }
      else {
        this.birthdayValidationStatus = false;
      }
    }
    if (elementName == "month") {
      if (element.value != "" && (this.signupForm.value.date == "" || this.signupForm.value.year == "")) {
        this.birthdayValidationStatus = true;
      }
      else {
        this.birthdayValidationStatus = false;
      }
    }
    if (elementName == "year") {
      if (element.value != "" && (this.signupForm.value.date == "" || this.signupForm.value.month == "")) {
        this.birthdayValidationStatus = true;
      }
      else {
        this.birthdayValidationStatus = false;
      }
    }

    // Password Validation ----------------------------
    if (elementName == "password") {
      this.passwordField = element;

      if (element.value.length == 0) {
        this.breakLineStatus = false;
      }
      if ((element.value.length > 0 && element.value.length < 5) && this.signupForm.value.confirmpassword == "") {
        this.passwordMatchStatus = false;
      }
      if (element.value == this.signupForm.value.confirmpassword) {
        this.breakLineStatus = false;
        this.passwordMatchStatus = false;
        this.passwordValidationStatus = false;
      }

      if (element.value.length > 0 && element.value.length < 5) {
        this.breakLineStatus = true;
        this.passwordValidationStatus = true;
      }
      else if (element.value.length > 0 && element.value != this.signupForm.value.confirmpassword) {
        this.breakLineStatus = false;
        this.passwordMatchStatus = true;
        this.passwordValidationStatus = false;
      }
      else {
        this.passwordValidationStatus = false;
      }
    }

    // Confirm Password Validation ---------------------------
    if (this.passwordField != null && elementName == "confirmpassword") {
      if (element.value != "") {
        if (this.passwordField.value != element.value && this.passwordField.value != "")
          this.passwordMatchStatus = true;
        else
          this.passwordMatchStatus = false;
      }
      else if (element.value == "" && this.passwordField.value != "") {
        this.passwordMatchStatus = true;
      }
      else {
        this.passwordMatchStatus = false;
      }
    }
  } // *** Function Ends ***

  resetErrorValidations() {
    this.invalidEmail = false;
    this.invalidPassword = false;
    this.loginService.setSigninErrorStatus("");
  }

  removeMsg() {
    setTimeout(() => { this.message = ""; }, 1500);
  }

  ngOnDestroy(){
    this.loginSubscription.unsubscribe();
  }
}// *** Class Ends ***
