import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { UserService } from '../_services';
import * as $ from 'jquery';

@Component({templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    _opened = false;
    menuItems = [
        {id: 1, name: 'wallet', displayName: 'Рахунок', icon: 'wallet.png', component: 'wallet'},
        {id: 2, name: 'cards', displayName: 'Картки', icon: 'cards.png', component: 'cards'},
        {id: 3, name: 'transactions', displayName: 'Транзакції', icon: 'transactions.png', component: 'transactions'},
        {id: 4, name: 'QR', displayName: 'Придбати QR', icon: 'qr2.png', component: 'QR'},
        /*{id: 5, name: 'koshik', displayName: 'Кошик', icon: 'koshik.png', component: 'koshik'},*/
        {id: 5, name: 'help', displayName: 'Допомога', icon: 'help.png', component: 'help'},
    ];
    currentPage = this.menuItems[0];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        $('.item-' + this.currentPage.name).addClass('menu-current');
    }

    ngOnInit() {
        // this.loadAllUsers();
    }

    private changeLocation(item) {
        if (item.name === this.currentPage.name) {
            return;
        }
        $('.menu-current').removeClass('menu-current');
        $('.item-' + item.name).addClass('menu-current');
        this.currentPage = item;
    }

    _toggleSidebar() {
        this._opened = !this._opened;
        $('#simply-burger').toggleClass('open');
    }

    menuAnimEffect($event) {
        $('.item-' + this.currentPage.name).addClass('menu-current');
        const e = $($event.target);
        const parentOffset = e.offset(),
            relX = $event.pageX - parentOffset.left,
            relY = $event.pageY - parentOffset.top;
        e.find('span.back').css({top: relY, left: relX});
    }
}
