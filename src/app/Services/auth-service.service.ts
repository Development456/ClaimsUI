import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UserDetails } from '../components/model/claim.model';
// import { environment } from 'src/environments/environment.prod';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  id: any
  user_Role = new BehaviorSubject("");
  userId = new BehaviorSubject("");
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  userRegister(data: any) {
    return this.http.post<any>(environment.LOGIN + '/user/signup', data, httpOptions).pipe(catchError((err: any) => {
      this.toastr.error(err.error.message, 'Registration Failed');
      return ([]);
    }));
  }

  loginValidation(requestBody: any) {
    return this.http.post(environment.LOGIN + '/user/signin', requestBody, httpOptions).pipe(catchError((err: any) => {
      this.toastr.error(err.error.message, 'Login Failed');
      return of([]);
    }));
  }

  changePassword(data: any) {
    return this.http.put(environment.LOGIN + '/user/changepassword', data, httpOptions)
      .pipe(catchError((err: any) => {

        if (err.error.text.includes("password changed successfully")) {
          this.toastr.success(err.error.text);
        } else if (err.status.includes("500")) {
          this.toastr.error('somthing went wrong');
        }
        else {
          this.toastr.error(err.error.text, 'Failed to change password');

        } return of([]);
      }));

  }

  getUserInfo() {

    var userDetails = window.sessionStorage.getItem('auth-user');
    var details = JSON.parse(userDetails || '{}');
    const id = this.userId.next(details.id);
    // console.log('url', environment.LOGIN + '/user/userinfo/' + details.id)
    return this.http.get<UserDetails[]>(environment.LOGIN + '/user/userinfo/' +details.id, httpOptions).pipe(catchError((err: any) => {
      this.toastr.error(err.error.message, 'GetUserInfo Failed');
      return of([]);

    }));
  }
  
  getAllUsers() {
    return this.http.get(environment.LOGIN + '/user/userslist').pipe(catchError((err: any) => {
      this.toastr.error('Api Failure with status code : ' + err.status, 'Get AllUsers Failed');
      return of([]);
    }));
  }

  editUser(data: any) {
    return this.http.put(environment.LOGIN + '/user/edituser', data).pipe(catchError((err: any) => {

      if (err.error.text.includes('Updated data')) {
        this.toastr.success(err.error.text);
      } else if (err.status.includes("500")) {
        this.toastr.error('Something went wrong');
      }
      else {
        this.toastr.error(err.error.message, 'Failed to update data');
      }
      return of([]);
    }));
  }
}