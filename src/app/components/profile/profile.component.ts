import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { UserDetails } from '../model/claim.model';
// import { UserDetails } from '../model/claim.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userdata: UserDetails[];
  roles: any;
  username: any;
  dataa: any = [];
  email: any;
  phone: any;
  users: any;
  id: any
  userdetails: any;
  filterdata: any;
  uname: any;
  role: any;

  constructor(private authService: AuthServiceService, private tokenStorage: TokenStorageService) {
    this.userdata = [{
      'username': '',
      'name': '',
      'email': '',
      'phone': ''
    }];

  }

  imageurl = localStorage.getItem('image');
  
  ngOnInit(): void {
    this.getuserInfo();

    this.users = JSON.parse(sessionStorage.getItem('1') || '[]')
    console.log(this.users);

    this.imageurl = sessionStorage.getItem('imageurl');
    console.log(this.imageurl);
    

  }






  // userdata = {
  //   "username": "abhi567",
  //   "password": "$2a$10$hO8/oCL93IKbezENoaoxRuJIWfpyBapYKODXcwWdQOvY3KWyqINuq",
  //   "name": "abhi567",
  //   "email": "abhi567@gmail.com",
  //   "phone": "2368428248",
  // }


  public getuserInfo() {
    this.authService.getUserInfo().subscribe(data => {
      this.userdata = data;

      // if(this.userdata)

      this.roles = this.tokenStorage.getUser().roles;
      this.username = this.tokenStorage.getUser().username;
      this.email = this.tokenStorage.getUser().email;
      this.phone = this.tokenStorage.getUser().phone;
      this.id = this.tokenStorage.getUser().id;
      console.log(this.tokenStorage.getUser())
      console.log(this.roles, this.username, "rolessss");

    })


    this.authService.getAllUsers().subscribe(data => {
      console.log(data, "All users data");
      this.userdetails = data;

      this.id = this.tokenStorage.getUser().id;

      this.filterdata = this.userdetails.filter((ele: any) => ele.id == this.id)[0];

      console.log(this.filterdata);
      
      this.role = this.filterdata.roles[0].name;
      console.log(this.role);
      

    })
  }


  test() {
    console.log(this.imageurl);

  }



}
