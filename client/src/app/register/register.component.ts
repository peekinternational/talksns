import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendConnector } from '../services/backendconnector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  //-- Birthday Variables -------------------------------------------------------------------------
  currentYear: number = 2019;
  minimumYear: number = 1920;

  dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
  years = [];
  //-----------------------------------------------------------------------------------------------

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

  usernameErrorMsg: string = "";
  emailErrorMsg: string = ""
  passwordField: HTMLInputElement;

  breakLineStatus: boolean = false;
  message: string = "";

  constructor(private formBuilder: FormBuilder, private connectorService: BackendConnector, private router: Router) {

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

  ngOnInit() { }

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

  removeMsg() {
    setTimeout(() => { this.message = ""; }, 1500);
  }
}// *** Class Ends ***
