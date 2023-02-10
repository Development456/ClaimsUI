import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  read = true;
  registerForm: any;
  errorMessage = '';
  imageurl: any = '';





  constructor(private authService: AuthServiceService, private tokenStorage: TokenStorageService,private toastr: ToastrService,) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.pattern("[a-zA-Z]*[0-9]*"), Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"), Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]),
      username: new FormControl('', [Validators.required, Validators.pattern("[a-z0-9]*")]),
      image: new FormControl('')
    })
    this.userdata = [{
      'username': '',
      'name': '',
      'email': '',
      'phone': '',
      'role': ''
    }];

  }

  
  ngOnInit(): void {
    this.getuserInfo();

    this.users = JSON.parse(sessionStorage.getItem('1') || '[]')
    console.log(this.users);

    // this.imageurl=sessionStorage.getItem("imageurl")

  }

  enable(){
    this.read = false;
  }

  public cancel() {
    // this.registerForm.reset();
    // this.registerForm.image.reset();
    this.registerForm.patchValue({
      id:this.filterdata.id,
      name : this.filterdata.name,
      email : this.filterdata.email,
      phone : this.filterdata.phone,
      username : this.filterdata.username,
      image : this.imageurl
    })
    this.read = true;
  }

  save(x:any){

    console.log(x);
    x["id"] = this.filterdata.id;
    this.authService.editUser(x).subscribe(data => {
      this.toastr.success('Data updated successfully')
    }, err =>{
      this.errorMessage = err.error.message;
    });

    sessionStorage.setItem("imageurl", this.imageurl);
    
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
      
      this.registerForm.patchValue({
        id:this.filterdata.id,
        name : this.filterdata.name,
        email : this.filterdata.email,
        phone : this.filterdata.phone,
        username : this.filterdata.username,
        image : this.imageurl
      })

    })
  }

  selectImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.imageurl = event.target?.result;
        console.log(this.imageurl);

      }
    }
  }




}
