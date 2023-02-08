import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { UserDetails } from '../model/claim.model';

@Component({
  selector: 'app-edit-information',
  templateUrl: './edit-information.component.html',
  styleUrls: ['./edit-information.component.css']
})
export class EditInformationComponent implements OnInit {
  userdata: UserDetails[];
  registerForm: any;
  imageurl: any = '';
  id: any
  userdetails: any;
  filterdata: any;
  check: any;
  

  constructor(private authService: AuthServiceService, private tokenStorage: TokenStorageService, private http : HttpClient, private router: Router) { 
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.pattern("[a-zA-Z]*[0-9]*"), Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"), Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]),
      username: new FormControl('', [Validators.required, Validators.pattern("[a-z0-9]*")]),
      image: new FormControl('')
    });

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
  }

  save(x:any){

    console.log(x);
    x["id"] = this.filterdata.id;
    this.authService.editUser(x).subscribe();
  }


  public cancel() {
    this.registerForm.reset();
    this.registerForm.image.reset();
  }

  selectImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.imageurl = event.target?.result;
        console.log(this.imageurl);

        localStorage.setItem("imageurl", this.imageurl);

      }
    }
  }

  public getuserInfo() {
    this.authService.getUserInfo().subscribe(data => {
      this.userdata = data;

      
      this.id = this.tokenStorage.getUser().id;
      console.log(this.tokenStorage.getUser())

    })


    this.authService.getAllUsers().subscribe(data => {
      console.log(data, "All users data");
      this.userdetails = data;

      this.id = this.tokenStorage.getUser().id;

      this.filterdata = this.userdetails.filter((ele: any) => ele.id == this.id)[0];

      console.log(this.filterdata);


      this.registerForm.patchValue({
        id:this.filterdata.id,
        name : this.filterdata.name,
        email : this.filterdata.email,
        phone : this.filterdata.phone,
        username : this.filterdata.username,
        image : this.filterdata.image
      })
      

    })
  }



}
