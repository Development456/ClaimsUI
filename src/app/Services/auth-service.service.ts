import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  auth_URL = 'http://172.174.113.233:9002'+'/user/';
  user_Role = new BehaviorSubject("");
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  userRegister(data: any){
    return this.http.post<any>(environment.LOGIN + '/user/signup', data, httpOptions).pipe(catchError((err:any) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Registration Failed');
      return of([]);
    }));
  }

  loginValidation(requestBody: any) {
    return this.http.post(environment.LOGIN + '/user/signin', requestBody, httpOptions).pipe(catchError((err:any ) => {
    this.toastr.error('Api Failure with status code : '+ err.status, 'Login Failed');
    return of([]);
    }));
  }
}