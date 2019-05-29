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
    settings = {
        columns: {
            name: {
                title: 'Назва',
                filter: false,
            },
            card_uid: {
                title: 'Номер',
                filter: false
            },
            obmez: {
                title: 'Обмеження',
                filter: false
            },
            pine: {
                title: 'Пін',
                filter: false,
                type: 'password',
            },
            status: {
                title: 'Статус',
                filter: false
            }
        },
        actions: {
            add: false,
            position: 'right'
        },
        edit: {
            editButtonContent: '<img src="../../assets/icons/edit.png"> Редагувати<br>',
            saveButtonContent: 'Зберегти <img src="../../assets/icons/save.png"><br>',
            cancelButtonContent: 'Скасувати <img src="../../assets/icons/cancle.png">',
        },
        delete: {
            deleteButtonContent: ' Видалити <img src="../../assets/icons/delete.png">',
        },
    };
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
    if (this.addData.name.length < 3 || this.addData.card_uid.length < 8 || this.addData.pin.length < 4 ) {
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
    /*onDeleteConfirm(event) {
        console.log('Delete Event In Console')
        console.log(event);
        if (window.confirm('Are you sure you want to delete?')) {
            event.confirm.resolve();
        } else {
            event.confirm.reject();
        }
    }

    onCreateConfirm(event) {
        console.log('Create Event In Console')
        console.log(event);

    }

    onSaveConfirm(event) {
        console.log('Edit Event In Console')
        console.log(event);
    }*/
   /* addWallet() {
        this.walletService.addWallet();
        console.log('you work');
        this.walletService.getWallets()
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
    }*/
    bet() {
        console.log('you work');
    }
    /*addUb() {
        this.walletService.addUbdate(this.addtabl);
        console.log('working');
        this.walletService.getUbdates()
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
    }*/
}

