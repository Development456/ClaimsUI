import { Component } from '@angular/core';
import { AuthServiceService } from './Services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'claims_Americold';
  roles = "";
  constructor(private loginService:AuthServiceService){}
  ngOnInit(){
    var userDetails = window.sessionStorage.getItem('auth-user');
    var details = JSON.parse(userDetails || '{}');
    this.roles = details.roles;
    if(this.roles.includes('ROLE_USER')){
      this.loginService.user_Role.next("user");
    }else{
      this.loginService.user_Role.next("admin");
    }
  }
}
