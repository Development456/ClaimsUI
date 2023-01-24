import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/Services/auth-service.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  submitted = false;


  // public userDetails = {
  //   username: '',
  //   email: '',
  //   password: ''
  // };
  public hide = true;
  // public signUpForm!: FormGroup;
  // public signUpFlag: boolean = true;
  isSignedIn = false;
  isSignedUpFailed = false;
  errorMessage = '';
  success = false;
  constructor(private authService: AuthServiceService, private route: Router, private registerForm: FormBuilder, private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.initForm(); 
  }
   
private initForm() {
    this.signUpForm = this.registerForm.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]],
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required,  Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.MustMatch('password', 'confirmPassword')
    });

    
  }

  get registerFormControl() : { [key: string]: AbstractControl }{
    return this.signUpForm.controls;
  }
 
  public userSignUp(){
    this.submitted = true;
    // const { username, email, password } = this.userDetails;
  debugger
    this.authService.userRegister(this.signUpForm.value).subscribe( data => {
        console.log(data);
        this.isSignedIn = true;
        this.isSignedUpFailed = false;
        // this.success = true;
        debugger
        console.log(data.message);
        alert(data.message);
        // this.route.navigate(['/login']);
      }, err => {
        // this.success = false;
        console.log(err.message);
        this.errorMessage = err.message;
        this.isSignedUpFailed = true;
        // console.log(this.errorMessage, 'error');
        // alert(this.errorMessage);
      });
  }

  public userLogin(){
    this.route.navigate(['/login']);
  }

// custom validator to check that two fields match
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  errorDialog(){
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  template: '<p>Password should be minimum 6 character long</p>',
})
export class DialogContentExampleDialog {}

