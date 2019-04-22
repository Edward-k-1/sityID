import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {WalletService} from '../_services/wallet.service';
import {first} from 'rxjs/operators';
import {AlertService} from '../_services';
import * as $ from 'jquery';
import { FormsModule } from '@angular/forms';
import {toBase64String} from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
    loading = false;
    wallet = {};
    currentUser;
    paymentAmount = 10;
    isWalletLoading = true;
    isStatLoading = true;
    isHistoryLoading = true;
    historyData;

    constructor(private walletServise: WalletService, private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
      this.loadWallet();
      this.loadHistory();
  }

  payInit() {
    $('li.add').toggleClass('active');
  }

  transactionInit() {
      $('li.transaction').toggleClass('active');
  }
  restrictionSetup() {
      $('li.restriction').toggleClass('active');
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

    private loadHistory() {
        this.walletServise.loadHistory()
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status) {
                        this.historyData = data.data;
                    }
                    this.isHistoryLoading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

  pay() {
      if (this.paymentAmount < 5) {
          return;
      }
      this.walletServise.pay(this.paymentAmount)
          .pipe(first())
          .subscribe(
              data => {
                  if (data.status) {
                      alert('cool');
                      $('#pay-block').html(data.form);
                      $('#pay-block form').submit();
                  }
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
  }
}
