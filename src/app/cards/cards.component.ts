import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {WalletService} from '../_services/wallet.service';
import {AlertService} from '../_services';
import {first} from 'rxjs/operators';
import {NgxSmartModalService} from "ngx-smart-modal";

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
            status: {
                title: 'Статус',
                filter: false
            }
        },
        actions: false
        /*edit: {
            editButtonContent: '<img src="../../assets/icons/edit.png"> Редагувати<br>',
            saveButtonContent: 'Зберегти <img src="../../assets/icons/save.png"><br>',
            cancelButtonContent: 'Скасувати <img src="../../assets/icons/cancle.png">',
        },
        delete: {
            deleteButtonContent: ' Видалити <img src="../../assets/icons/delete.png">',
        },*/
    };

  constructor(private walletService: WalletService, private alertService: AlertService, public ngxSmartModalService: NgxSmartModalService) { }

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
    if (this.addData.name.length < 3 || this.addData.card_uid.length < 3  ) {
      this.alertService.error('Невірні дані картки');
      this.addData.name = null;
      this.addData.card_uid = null;
      return;
    }
    this.walletService.addCard(this.addData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status) {
            this.alertService.success('Картка успішно додана');
            this.loadCards();
            /*for (let i = 0; i < this.trips; i++) {
                this.result.pop();
            }*/
            this.addData.name = null;
            this.addData.card_uid = null;
            this.ngxSmartModalService.resetModalData('myCard');
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
  viewDiv() {
    document.getElementById('div1').style.display = 'block';
    $('#but').button('toggle');
  }
  div() {
    $('#div1').toggle();
  }
  div2() {
    $('#div2').toggle();
  }
  div3() {
    $('#div3').toggle();
  }

}

