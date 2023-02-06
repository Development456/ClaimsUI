import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { ChangePasswordComponent } from '../profile/change-password/change-password.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() dashboard: any;
  userName:string = "";
  userRole:string = "";
  constructor(private router: Router,private LoginService:AuthServiceService, 
    private tokenStorage: TokenStorageService, private dialog: MatDialog) { }

  ngOnInit(): void {
    var userDetails = window.sessionStorage.getItem('auth-user');
    var details = JSON.parse(userDetails || '{}');
    this.userName = details.username;
    this.userName = this.userName.split(" ").map(([firstChar,...rest])=>firstChar.toUpperCase()+rest.join("").toLowerCase()).join(" ");
    this.LoginService.user_Role.subscribe(role=>{
      this.userRole = role;
    })
  }

  toggleMenu(){
    console.log(this.dashboard.toggle());
  }

  public onLogOut() {
    this.tokenStorage.signOut();
    this.router.navigate(['login']);
  }

  changePassword() {
		const dialogRef = this.dialog.open(ChangePasswordComponent, {
      height:'450px', width:'700px' 
    });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				location.reload();
			}
		});
	}


}
