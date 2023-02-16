import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { LoginDetails } from '../model/claim.model';
import { UpdatePasswordComponent } from './update-password/update-password.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  public hide = true;
  public loginForm!: FormGroup;
  public loginFlag: boolean = true;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  id = "";
  public userDetails = {
    username: '',
    password: ''
  }

  public roles: string[] = [];
  constructor(private router: Router, public dialog: MatDialog, private loginService: AuthServiceService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.initForm();
    this.jwToken();
  }
  

  userLogin() {
    const { username, password } = this.loginForm.value;
    const loginDetails = {
    username: username,
    password: password
    }
    
      this.loginService.loginValidation(loginDetails).subscribe(data => {
     
        var stringObject:any;
        stringObject=JSON.stringify(data);
        stringObject=JSON.parse(stringObject);
        let loginData:LoginDetails=<LoginDetails>stringObject;

        if (loginDetails.username != loginData.username && loginDetails.password != loginData.accessToken){
          this.loginFlag = false;
        } else {
          this.tokenStorage.saveToken(loginData.accessToken);   
          this.tokenStorage.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true
          this.loginFlag = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.router.navigate(['/home']);
          var userDetails = window.sessionStorage.getItem('auth-user');
          var details = JSON.parse(userDetails || '{}');
          this.id = details.id;
          if(this.roles.includes('ROLE_USER')){
            this.loginService.user_Role.next("user");
            this.loginService.userId.next(this.id);
          }else{
            this.loginService.user_Role.next("admin");
          }
        }
       }, err => {
          this.errorMessage = err.message;
          console.log(this.errorMessage, 'error');
          this.loginFlag = false;
        }); 
  
  
  }
    

  public userSignUp(){
    this.router.navigate(['/signUp']);
  }

  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)])
    })
  }

  get loginFormControl() : { [key: string]: AbstractControl }{
    return this.loginForm.controls;
  }

  private jwToken() {
    if(this.tokenStorage.getToken()){
      this.loginFlag = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  } 
  public onFormReset() {
    this.loginForm.controls['username'].setValue('');
    this.loginForm.controls['password'].setValue('');
  }

  public updatePasswordDialog(){
    const dialogRef = this.dialog.open(UpdatePasswordComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }
}
