import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  auth_URL = 'http://localhost:8300/api/auth/';
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  userRegister(data: any){
    return this.http.post<any>(this.auth_URL + 'signup', data, httpOptions).pipe(catchError((err:any) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Registration Failed');
      return of([]);
    }));
  }

  loginValidation(requestBody: any) {
    return this.http.post(this.auth_URL + 'signin', requestBody, httpOptions).pipe(catchError((err:any ) => {
    this.toastr.error('Api Failure with status code : '+ err.status, 'Login Failed');
    return of([]);
    }));
  }
}
