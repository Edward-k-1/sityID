import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {WalletService} from '../_services/wallet.service';
import {AlertService} from '../_services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
    userCards;
    isCardsLoading = true;
    addData = {name: '', card_uid: '', pin: ''};

  constructor(private walletService: WalletService, private alertService: AlertService) { }

  ngOnInit() {
      this.loadCards();
  }

  addInit() {
    $('.add-card').toggleClass('active');
  }

  private loadCards() {
    this.isCardsLoading = true;
      this.walletService.getCards()
          .pipe(first())
          .subscribe(
              data => {
                  if (data.status) {
                    this.userCards = data.data;
                    this.isCardsLoading = false;
                  }
              },
              error => {
                  this.alertService.error(error);
              });
  }

  addCard() {
    if (this.addData.name.length < 3 || this.addData.card_uid.length < 8 || this.addData.pin.length < 4) {
      this.alertService.error('Невірні дані картки');
      return;
    }
    this.walletService.addCard(this.addData)
        .pipe(first())
        .subscribe(
            data => {
                if (data.status) {
                    this.alertService.success('Картка успішно додана');
                    this.loadCards();
                } else {
                    this.alertService.error(data.reason);
                }
            },
            error => {
                this.alertService.error(error);
            });

  }
}
