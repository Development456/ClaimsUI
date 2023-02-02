import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-information',
  templateUrl: './edit-information.component.html',
  styleUrls: ['./edit-information.component.css']
})
export class EditInformationComponent implements OnInit {
  registerForm: any;
  url: any;

  constructor() { 
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.pattern("[a-zA-Z]*"), Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"), Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]),
      username: new FormControl('', [Validators.required, Validators.pattern("[a-z0-9]*")]),
    });
  }

  ngOnInit(): void {
  }

  public save() {
    window.alert("Details saved")
  }

  public cancel() {
    this.registerForm.reset();
  }

  selectImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event.target?.result;
        console.log(this.url);

      }
    }
  }

}
