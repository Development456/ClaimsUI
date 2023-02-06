import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  userdata = {
    "username": "abhi567",
    "password": "$2a$10$hO8/oCL93IKbezENoaoxRuJIWfpyBapYKODXcwWdQOvY3KWyqINuq",
    "name": "abhi567",
    "email": "abhi567@gmail.com",
    "phone": "2368428248",
  }


}
