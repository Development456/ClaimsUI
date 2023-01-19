import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { ClaimsApiService } from 'src/app/Services/claims-api.service';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { LoginDetails } from '../model/claim.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  public hide = true;
  public loginForm!: FormGroup;
  public loginFlag: boolean = true;
  errorMessage = '';
  public userDetails = {
    username: "admin",
    password: "test"
  }

  public roles: string[] = [];
  constructor(private router: Router, public signUpDialog: MatDialog, private loginService: AuthServiceService, private tokenStorage: TokenStorageService) { }

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
    if (data) {

      var stringObject:any;
      stringObject=JSON.stringify(data);
      stringObject=JSON.parse(stringObject);
      let loginData:LoginDetails=<LoginDetails>stringObject;
      console.log('userDetails',loginData.accessToken)
   
      this.tokenStorage.saveToken(loginData.accessToken);
      this.tokenStorage.saveUser(data);
   
      console.log('userDetails', data )
      localStorage.setItem('userDetails', 'admin');
      this.loginFlag = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/home']);

    }
   }, err => {
      this.errorMessage = err.error.message;
      this.loginFlag = false;
    });
  }
    

  public userSignUp(){
    this.router.navigate(['/signUp']);
  }

  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
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
}
