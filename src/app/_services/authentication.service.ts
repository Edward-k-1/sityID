import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {User} from '../_models';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, httpOptions)
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, body.toString(), httpOptions)
      // console.log({ login: username, password: password });
      // return this.http.post<any>(`http://mac.ua/auth/login`, { login: username, password: password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        console.log(user);
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    const body = new HttpParams()
      .set('phone', user.phone.toString())
      .set('username', user.username)
      .set('password', user.password);
    // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, httpOptions)
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, body.toString(), httpOptions)
      // console.log({ login: username, password: password });
      // return this.http.post<any>(`http://mac.ua/auth/login`, { login: username, password: password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        console.log(data);
        // if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // }

        return data;
      }));
  }
  confirm(code: string, user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    const body = new HttpParams()
      .set('phone', user.phone.toString())
      .set('username', user.username)
      .set('code', code)
      .set('password', user.password);
    // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, httpOptions)
    return this.http.post<any>(`${environment.apiUrl}/auth/confirm`, body.toString(), httpOptions)
      // console.log({ login: username, password: password });
      // return this.http.post<any>(`http://mac.ua/auth/login`, { login: username, password: password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        console.log(data);
        // if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // }

        return data;
      }));
  }
  resetpass(number: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    const body = new HttpParams()
      .set('phone2', number);
    return this.http.post<any>(`${environment.apiUrl}/auth/resetpass`, body.toString(), httpOptions)
      .pipe(map(data => {
        console.log(data);
        return data;
      }));
  }

  codePass(code2: string, number: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    const body = new HttpParams()
      .set('code2', code2)
      .set('phone', number);
    return this.http.post<any>(`${environment.apiUrl}/auth/coder`, body.toString(), httpOptions)
      .pipe(map(data =>{
        console.log(data);
        return data;
      }));
  }

  newPass(pass: string, number: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };
    const body = new HttpParams()
      .set('phone2', number)
      .set('pass', pass);
    return this.http.post<any>(`${environment.apiUrl}/auth/newpass`, body.toString(), httpOptions)
      .pipe(map(data =>{
        console.log(data);
        return data;
      }));
  }
}
