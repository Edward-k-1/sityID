import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import * as $ from 'jquery';

import { AlertService, AuthenticationService } from '../_services';
import {NgxSmartModalService} from "ngx-smart-modal";
import {passBoolean} from "protractor/built/util";

@Component({templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']})
  export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  confirmForm: FormGroup;
  numberForm: FormGroup;
  codeForm: FormGroup;
  newPassword: FormGroup;

  addData = {newPassw: '', confirmPass: ''};
  newPassw: FormControl;
  confirmPass: FormControl;


  loading = false;
  submitted = false;
  returnUrl: string;
  codeSent = false;
  newUserData = undefined;
  confirmed = false;

  reciverNumber = true;
  codeSent2 = false;
  newPass = false;

  phone2: string;
  code: string;
  pass: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private alertService: AlertService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    this.registerForm = this.formBuilder.group({
      username: ['',  [Validators.pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/ ), Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.confirmForm = this.formBuilder.group({
      confirm: ['', [Validators.required, Validators.minLength(4)]]
    });
    //!(frs.phone2.errors.pattern) && !
    this.numberForm = this.formBuilder.group({
    phone2: ['', [Validators.pattern(/^[0][0-9]{9}/), Validators.required, Validators.maxLength(10)]]
    });
    this.codeForm = this.formBuilder.group({
      code2: ['', [Validators.pattern(/^[0-9]{6}/), Validators.required, Validators.maxLength(6)]]
    });
    this.newPassword = this.formBuilder.group({
      newPassw: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', [Validators.required, Validators.minLength(6)]]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.createFormControls();
    this.createForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get fr() { return this.registerForm.controls; }
  get fc() { return this.confirmForm.controls; }
  get frs() {return this.numberForm.controls;}
  get frc() {return this.codeForm.controls;}
  get fnp() {return this.newPassword.controls;}
  //get fp() {return this.newPassw.controls;}

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.submitted = false;
            this.loading = false;
            this.alertService.error('Невірні дані авторизації');
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  doRegister() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.newUserData = this.registerForm.value;
    this.authenticationService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code === 1 ){//&& data.data === true) {
            this.codeSent = true;
          } else {
            if (data.code === 101) {
              this.alertService.error('Даний номер уже зареєстровано.');
            }
          }
          this.submitted = false;
          this.loading = false;
          // this.alertService.success('Registration successful', true);
          //this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  finishRegister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.confirmForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.confirm(this.confirmForm.value.confirm, this.newUserData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status) {
            this.confirmed = true;
            this.alertService.success('Користувач успішно зареєстрований.');
          } else {
            this.alertService.error('Неправильний код.');
          }
          this.loading = false;
          this.submitted = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  registerToggle() {
    $('.cont').toggleClass('s--signup');
  }
  // document.querySelector('.img__btn').addEventListener('click', function() {
  //     document.querySelector('.cont').classList.toggle('s--signup');
  // });

  resetPassword() {
    this.submitted = true;
    this.loading = true;
    this.authenticationService.resetpass(this.frs.phone2.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code === 1 ){//&& data.data === true) {
            this.reciverNumber = false;
            this.codeSent2 = true;
            this.alertService.success('Код підтвердження відправлено на вказаний номер.');
          } else {
            if (data.code === 101) {
              this.alertService.error('Номер телефону не зареєстрований в системі.');

            }
          }

          this.loading = false;
          this.submitted = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  codeSentt() {
    this.submitted = true;
    this.loading = true;
    console.log("Дані:");
    console.log(this.frc.code2.value);
    console.log(this.frs.phone2.value);
    this.authenticationService.codePass(this.frc.code2.value, this.frs.phone2.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.success) {
            this.codeSent2 = false;
            this.newPass = true;
            this.alertService.success('Код вірний');
          } else {
            this.alertService.error('Неправильний код.');
          }
          this.loading = false;
          this.submitted = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  newPasss(){
    this.submitted = true;
    this.loading = true;
    this.authenticationService.newPass(this.fnp.newPassw.value, this.frs.phone2.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status) {
            this.newPass = true;
            this.alertService.success('Пароль користувача змінено');
            this.ngxSmartModalService.close('myForm');
            this.ngxSmartModalService.resetModalData('myForm');
            this.reciverNumber = true;
            this.codeSent2 = false;
            this.newPass = false;
            this.ngOnInit();
          } else {
            this.alertService.error('Сталася помилка при зміні паролю');
          }
          this.loading = false;
          this.submitted = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    if (this.newPassword.valid) {
      this.newPassword.reset();
    }
  }

  createFormControls() {
    this.newPassw = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/)
    ]);
    this.confirmPass = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/)
    ]);
  }
  isControlInvalid(formname: FormGroup, controlName: string, par: boolean): boolean {
    const control = formname.controls[controlName];
    if(par) return control.invalid&&control.touched; else return control.invalid;

  }
  createForm() {
    this.newPassword = new FormGroup({
      newPassw: this.newPassw,
      confirmPass: this.confirmPass
    });
  }
}

