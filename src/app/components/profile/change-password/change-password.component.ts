import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { DialogContentExampleDialog } from '../../login/sign-up/sign-up.component';
import { Data } from '../../model/claim.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
 
  changePasswordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  submitted = false;
  public hide = true;

  constructor(private registerForm: FormBuilder, private authService: AuthServiceService, 
    private tokenStorage: TokenStorageService, private router: Router, private dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  public onLogOut() {
    this.tokenStorage.signOut();
    this.router.navigate(['login']);
  }

  private initForm() {
    this.changePasswordForm = this.registerForm.group({
      currentPassword: ['',Validators.required,],
      newPassword: ['', [Validators.required,  Validators.minLength(8), Validators.maxLength(12), 
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
      confirmPassword: ['', Validators.required],
    });
  }

  get passwordFormControl() : { [key: string]: AbstractControl }{
    return this.changePasswordForm.controls;
  }

  public passwordChange(){
    this.submitted = true;
    this.authService.changePassword(this.changePasswordForm.value).subscribe(data => {
      
      var stringObject:any;
      stringObject=JSON.stringify(data);
      stringObject=JSON.parse(stringObject);
      let res:Data = <Data>stringObject;
      
      if(res.message.includes("Password Changed Successfully!")){
        this.toastr.success(res.message);
        this.onLogOut();
      } 

    });

  }

  public cancelchangePasswordForm(){
    this.submitted = false;
    this.changePasswordForm.reset();
  }

  public resetForm(){
    this.changePasswordForm.reset();
  }

  public infoDialog(){
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

}

