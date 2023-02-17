import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { json } from 'stream/consumers';
import { UserDetails } from '../model/claim.model';

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
  constructor(private authService: AuthServiceService, private tokenStorage: TokenStorageService, private toastr: ToastrService,) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.pattern("[a-zA-Z]*"), Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"), Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]),
      username: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9]*")]),
      image: new FormControl('')
    })
    this.userdata = [{
      'username': '',
      'name': '',
      'email': '',
      'phone': ''
    }];
  }
  ngOnInit(): void {
    this.getuserInfo();
  }
  enable() {
    this.read = false;
  }
  public cancel() {
    this.registerForm.patchValue({
      id: this.filterdata.id,
      name: this.filterdata.name,
      email: this.filterdata.email,
      phone: this.filterdata.phone,
      username: this.filterdata.username,
      image: this.imageurl
    })
    this.read = true;
  }
  save(x: any) {
    console.log(x);
    x["id"] = this.filterdata.id;
    this.authService.editUser(x).subscribe(data => {
      this.toastr.success('Data updated successfully')
    }, err => {
      this.errorMessage = err.error.message;
    });
  }
  public getuserInfo() {
    this.authService.getUserInfo().subscribe(data => {
      this.filterdata = data
      this.registerForm.patchValue({
        id: this.filterdata.id,
        name: this.filterdata.name,
        email: this.filterdata.email,
        phone: this.filterdata.phone,
        username: this.filterdata.username,
        image: this.imageurl
      })
      this.roles = this.tokenStorage.getUser().roles;
      this.username = this.tokenStorage.getUser().username;
      this.email = this.tokenStorage.getUser().email;
      this.phone = this.tokenStorage.getUser().phone;
      this.id = this.tokenStorage.getUser().id;

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
