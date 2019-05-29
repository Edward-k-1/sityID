import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as $ from 'jquery';

import { AlertService, AuthenticationService } from '../_services';

@Component({templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    confirmForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    codeSent = false;
    newUserData = undefined;
    confirmed = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.registerForm = this.formBuilder.group({
            username: ['',  [Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/), Validators.required, Validators.minLength(3)]],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.confirmForm = this.formBuilder.group({
            confirm: ['', [Validators.required, Validators.minLength(4)]]
        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    get fr() { return this.registerForm.controls; }
    get fc() { return this.confirmForm.controls; }

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
                    if (data.code === 1 && data.data.success) {
                        this.codeSent = true;
                    } else {
                        if (data.code === 101) {
                            this.alertService.error('Даний номер уже зареєстровано.');
                        }
                    }
                    this.submitted = false;
                    this.loading = false;
                    // this.alertService.success('Registration successful', true);
                    // this.router.navigate(['/login']);
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
}
