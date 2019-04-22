import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {User} from '../_models';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Injectable()
export class HelpService {
    constructor(private http: HttpClient, public ngxSmartModalService: NgxSmartModalService) { }

    load() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded',
            })
        };
        // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, httpOptions)
        return this.http.get<any>(`${environment.apiUrl}/v1/help`, httpOptions)
        // console.log({ login: username, password: password });
        // return this.http.post<any>(`http://mac.ua/auth/login`, { login: username, password: password })
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                console.log(data);

                return data;
            }));
    }
        addHelp(c) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded',
            })
        };
        const body = new HttpParams()
            .set('email', c.email)
            .set('text', c.text);
        return this.http.post<any>(`${environment.apiUrl}/v1/help/helps`, body.toString(), httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    getHelps() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/help/help`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }
}

