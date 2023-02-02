import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
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

  public hide = true;
  isSignedIn = false;
  isSignedUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthServiceService, private toastr: ToastrService,
    private route: Router, private registerForm: FormBuilder, private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.initForm(); 
    
  }
   
private initForm() {
    this.signUpForm = this.registerForm.group({
      username: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required,  Validators.minLength(8), Validators.maxLength(12), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.MustMatch('password', 'confirmPassword')
    });

    
  }

  get registerFormControl() : { [key: string]: AbstractControl }{
    return this.signUpForm.controls;
  }
 
// custom validator to check that two fields match
  public MustMatch(controlName: string, matchingControlName: string) {
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

  
  public userSignUp(){
    this.submitted = true;
    this.authService.userRegister(this.signUpForm.value).subscribe( data => {
        
        this.isSignedIn = true;
        this.isSignedUpFailed = false;
        this.toastr.success(data.message, 'Registration Successfull');
        this.route.navigate(['/login']);
        
      }, err =>{
        this.isSignedUpFailed = true;
        this.errorMessage = err.error.message;
        
      });
  }

  public resetForm(){
    this.submitted = false;
    this.signUpForm.reset();
  }

  public infoDialog(){
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  template: ` <ul>
                  <li class="text-danger">Password must contain minimum of 8 characters</li>
                  <li class="text-danger">Atleast 1 uppercase and lowercase letters</li>
                  <li class="text-danger">One or more numerical value.</li>
                  <li class="text-danger">Atleast 1 special character [!@#$%^&*_=+-]</li>
              </ul>`
  
})
export class DialogContentExampleDialog {}

