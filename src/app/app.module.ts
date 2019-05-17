import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend

import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService } from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { SidebarModule } from 'ng-sidebar';
import { WalletComponent } from './wallet/wallet.component';
import { WalletService } from './_services/wallet.service';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CardsComponent } from './cards/cards.component';
import { QRComponent } from './qr/qr.component';
import {QRService} from './_services/qr.service';
import { HelpComponent } from './help/help.component';
import {HelpService} from './_services/help.service';
import { KoshikComponent } from './koshik/koshik.component';
import { ModalModule } from 'ngb-modal';
import { NgxQRCodeModule} from 'ngx-qrcode3';
import { QRCodeModule } from 'angularx-qrcode';
import { ResponsiveModule } from 'ngx-responsive';
import {DataTableModule} from 'angular-6-datatable';
import { TransactionsComponent } from './transactions/transactions.component';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        SidebarModule.forRoot(),
        NgxSmartModalModule.forRoot(),
        FormsModule,
        QRCodeModule,
        FormsModule,
        ModalModule,
        NgxQRCodeModule,
        ResponsiveModule.forRoot(),
        DataTableModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        WalletComponent,
        CardsComponent,
        QRComponent,
        HelpComponent,
        KoshikComponent,
        TransactionsComponent
             ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        WalletService,
        QRService,
        HelpService,
        NgxSmartModalService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
