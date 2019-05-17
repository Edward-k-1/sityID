import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
/*import {User} from '../_models';*/
import {NgxSmartModalService} from 'ngx-smart-modal';
import {pipe} from 'rxjs';


@Injectable()
export class QRService {
    constructor(private http: HttpClient, public ngxSmartModalService: NgxSmartModalService) {
    }

    load() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, httpOptions)
        return this.http.get<any>(`${environment.apiUrl}/v1/qr`, httpOptions)
        // console.log({ login: username, password: password });
        // return this.http.post<any>(`http://mac.ua/auth/login`, { login: username, password: password })
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                console.log(data);
                return data;
            }));
    }

    addQR(c) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        const body = new HttpParams()
            .set('poizdka', c.poizdka)
            .set('tsina_qr', c.tsina_qr);
        return this.http.post<any>(`${environment.apiUrl}/v1/qr/qrs`, body.toString(), httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    getQRs() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/qr/qr`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }
    addWallet(c) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        const body = new HttpParams()
            .set('wallet', c.wallet);
        return this.http.post<any>(`${environment.apiUrl}/v1/qr/wallets`, body.toString(), httpOptions)
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
        return this.http.get<any>(`${environment.apiUrl}/v1/qr/wallet`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }
    getTransctions() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/transactions/transctions`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }

    getTr() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.http.get<any>(`${environment.apiUrl}/v1/transactions/transctionss`, httpOptions)
            .pipe(map(data => {
                console.log(data);
                return data;
            }));
    }
}

