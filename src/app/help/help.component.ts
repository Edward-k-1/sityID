import { Component, OnInit } from '@angular/core';
import {HelpService} from '../_services/help.service';
import {AlertService} from '../_services';
import * as $ from 'jquery';
import {first} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';




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
    myform: FormGroup;
    email: FormControl;
    password: FormControl;
  constructor(private helpService: HelpService, private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadHelp();
      this.createFormControls();
      this.createForm();
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
    createFormControls() {
        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern('[^ @]*@[^ @]*')
        ]);
        this.password = new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]);
    }

    createForm() {
        this.myform = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    onSubmit() {
        if (this.myform.valid) {
            console.log('Form Submitted!');
            this.myform.reset();
        }
    }


}
