import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {User} from '../_models';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {Observable} from 'rxjs';
import {identifierModuleUrl} from '@angular/compiler';

@Injectable()
export class WalletService {
    constructor(private http: HttpClient, public ngxSmartModalService: NgxSmartModalService) {
    }

    load() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, httpOptions)
        return this.http.get<any>(`${environment.apiUrl}/v1/wallet`, httpOptions)
        // console.log({ login: username, password: password });
        // return this.http.post<any>(`http://mac.ua/auth/login`, { login: username, password: password })
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                console.log(data);

                return data;
            }));
    }

    pay(a: number) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        const body = new HttpParams()
            .set('amount', a.toString());
        return this.http.post<any>(`${environment.apiUrl}/v1/wallet/pays`, body.toString(), httpOptions)
            .pipe(map(data => {
                console.log(data);

                return data;
            }));
    }

    loadHistory() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/wallet/history`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    addCard(c) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        const body = new HttpParams()
            .set('name', c.name)
            .set('card_uid', c.card_uid)
            .set('pin', c.pin);
        return this.http.post<any>(`${environment.apiUrl}/v1/wallet/cadd`, body.toString(), httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    getCards() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/wallet/cards`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    addWallet() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.delete<void>(`${environment.apiUrl}/v1/wallet/wallet`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    getWallets() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/wallet/wallets`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }
    addUbdate(c) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        const body = new HttpParams()
            .set('name', c.name)
            .set('card_uid', c.card_uid)
            .set('obmez', c.obmez)
            .set('status', c.status)
            .set('pine', c.pine);
        return this.http.post<any>(`${environment.apiUrl}/v1/wallet/ubdate`, body.toString(), httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    getUbdates() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/wallet/ubdates`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }
}
