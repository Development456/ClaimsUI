import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
 
  changePasswordForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
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
      username: ['', Validators.required],
      currentPassword: ['',Validators.required,],
      newPassword: ['', [Validators.required,  Validators.minLength(8), Validators.maxLength(12), 
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
    });
  }

  get passwordFormControl() : { [key: string]: AbstractControl }{
    return this.changePasswordForm.controls;
  }

  public passwordChange(){
    this.submitted = true;
    this.authService.changePassword(this.changePasswordForm.value).subscribe(data => {
      console.log(data,'test');
      // this.onLogOut();
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

