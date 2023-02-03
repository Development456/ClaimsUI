import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
 // auth_URL = environment.AUTH_URL+'/user/';

  user_Role = new BehaviorSubject("");
  userId = new BehaviorSubject("");
  constructor(private http: HttpClient, private toastr: ToastrService) { }

   userRegister(data: any){
    return this.http.post<any>(environment.LOGIN + '/user/signup', data, httpOptions).pipe(catchError((err:any) => {
      this.toastr.error(err.error.message, 'Registration Failed');
      return ([]);
    }));
  }

  loginValidation(requestBody: any) {
    return this.http.post(environment.LOGIN + '/user/signin', requestBody, httpOptions).pipe(catchError((err:any ) => {
    this.toastr.error(err.error.message, 'Login Failed');
    return of([]);
    }));
  }

  changePassword(data: any){
    return this.http.post(environment.LOGIN + '/user/changepassword', data, httpOptions).pipe(catchError((err:any ) => {
      this.toastr.error(err.error.message, 'Failed to change password');
      return of([]);
      }));
  }
}
