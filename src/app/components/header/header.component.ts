import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { EditInformationComponent } from '../edit-information/edit-information.component';
import { ProfileComponent } from '../profile/profile.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() dashboard: any;
  userName:string = "";
  userRole:string = "";
  constructor(private router: Router,private LoginService:AuthServiceService, public dialog: MatDialog) { }

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
    localStorage.removeItem('userDetails');
    this.router.navigate(['login']);
  }

  public userProfile() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      height: '650px',
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        location.reload();
      }
    });
  }

  public editInfo() {
    // this.router.navigate(['/edit']);
    const dialogRef = this.dialog.open(EditInformationComponent, {
      height:'650px', 
      width:'700px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        location.reload();
      }
    });
  }

  public changePassword(){

  }

  public role(){
    
  }

}
