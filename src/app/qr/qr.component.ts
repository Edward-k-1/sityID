import {Component, OnInit} from '@angular/core';
import {AlertService} from '../_services';
import * as $ from 'jquery';
import {WalletService} from '../_services/wallet.service';
import {first} from 'rxjs/operators';
import {QRService} from '../_services/qr.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})



export class QRComponent implements OnInit {
    userQR;
    isQRLoading = true;
    loading = false;
    wallet = {};
    currentUser;
    isWalletLoading = true;
    tax = [
        {id: 0, name: 'Дитячий', tax: 2, value: 'child'},
        {id: 1, name: 'Дорослий', tax: 5, value: 'parent'}
    ];
    trips: number;
    amount = 0;
    result = [];
    addData = {poizdka: '', tsina_qr: 0, wallet: 0};
    constructor(private walletServise: WalletService, private qrServise: QRService, private alertService: AlertService, public ngxSmartModalService: NgxSmartModalService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userQR = JSON.parse(localStorage.getItem('userQR'));
    }

    ngOnInit() {
        this.loadWallet();
        this.loadQR();
    }

    addInit() {
        /*$('.add-qr').toggleClass('active');*/
    }

    ReCalculate(value) {
        if (value === 'child') {
            this.amount -= 3;
        } else {
            this.amount += 3;
        }
    }

    calculateAmount() {

        this.result = [];
        for (let i = 0; i < this.trips; i++) {

            /*if (i + 1 === this.trips)*/
            this.result.push({id: i, type: 0});
            console.log(this.result[i]);

        }
        this.amount = this.tax[1].tax * this.trips;
    }

    private loadWallet() {
        this.walletServise.load()
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status) {
                        this.currentUser.wallet = data.wallet;
                        this.currentUser.type = data.type;
                    }
                    this.isWalletLoading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private loadQR() {
        this.isQRLoading = true;
        this.qrServise.getQRs()
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status) {
                        this.userQR = data.data;
                        this.isQRLoading = false;
                    }
                },
                error => {
                    this.alertService.error(error);
                });
        this.qrServise.getWallets()
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status) {
                    }
                },
                error => {
                    this.alertService.error(error);
                });
    }

    addQR() {
        if (this.addData.poizdka.length > 20) {
            this.alertService.error('Некоректне число поїздок');
            return;
        }
        this.addData.tsina_qr = this.amount;
        this.qrServise.addQR(this.addData)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status) {
                        this.alertService.success('QR придбано');
                        this.loadQR();
                    } else {
                        this.alertService.error(data.reason);
                    }
                },
                error => {
                    this.alertService.error(error);
                });
        this.addData.wallet = this.amount;
        this.qrServise.addWallet(this.addData)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status) {
                        this.alertService.success('QR придбано');
                        this.loadQR();
                    } else {
                        this.alertService.error(data.reason);
                    }
                },
                error => {
                    this.alertService.error(error);
                });
        }
    }
