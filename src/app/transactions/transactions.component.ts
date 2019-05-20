import { Component, OnInit } from '@angular/core';
import { QRService} from '../_services/qr.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../_services';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  userTransactions;
  userTr;
  isQRLoading = true;
  loading = false;
  constructor(private qrServise: QRService, private alertService: AlertService) {
    this.userTransactions = JSON.parse(localStorage.getItem('userTransactions'));
    this.userTr = JSON.parse(localStorage.getItem('userTr'));
  }

  ngOnInit() {
    this.loadTransactions();
    this.loadTr();
  }
  private loadTransactions() {
    this.isQRLoading = true;
    this.qrServise.getTransctions()
        .pipe(first())
        .subscribe(
            data => {
              if (data.status) {
                this.userTransactions = data.data;
                this.isQRLoading = false;
              }
            },
            error => {
              this.alertService.error(error);
            });
  }
  private loadTr() {
    this.isQRLoading = true;
    this.qrServise.getTr()
        .pipe(first())
        .subscribe(
            data => {
              if (data.status) {
                this.userTr = data.data;
                this.isQRLoading = false;
              }
            },
            error => {
              this.alertService.error(error);
            });
  }
}
