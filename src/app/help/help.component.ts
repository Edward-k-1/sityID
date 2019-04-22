import { Component, OnInit } from '@angular/core';
import {HelpService} from '../_services/help.service';
import {AlertService} from '../_services';
import * as $ from 'jquery';
import {first} from 'rxjs/operators';




@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  userHelp;
  currentUser;
  isHelpLoading = true;
  addData = {email: '', text: ''};

  constructor(private helpService: HelpService, private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadHelp();
  }

  /*addInit() {
    $('.add-help').toggleClass('active');
  }*/

  private loadHelp() {
    this.isHelpLoading = true;
    this.helpService.getHelps()
        .pipe(first())
        .subscribe(
            data => {
              if (data.status) {
                this.userHelp = data.data;
                this.isHelpLoading = false;
              }
            },
            error => {
              this.alertService.error(error);
            });
  }

  addHelp() {
    if (this.addData.email.length < 8 || this.addData.text.length < 10) {
      this.alertService.error('Некоректне запитання');
      return;
    }
    this.helpService.addHelp(this.addData)
        .pipe(first())
        .subscribe(
            data => {
              if (data.status) {
                this.alertService.success('Запитання надіслано');
                this.loadHelp();
              } else {
                this.alertService.error(data.reason);
              }
            },
            error => {
              this.alertService.error(error);
            });

  }
}
