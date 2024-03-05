import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRootComponent } from './app.root.component';
import { AppComponent } from './in/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedLibModule, CustomDateAdapter } from 'sb-shared-lib';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import { TopBarComponent } from './_components/top-bar/top-bar.component';
import { LargeComponent } from './in/large/large.component';

@NgModule({
    declarations: [AppRootComponent, AppComponent, TopBarComponent, LargeComponent],
    imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule, SharedLibModule],
    providers: [
        // add HTTP interceptor to inject AUTH header to any outgoing request
        // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: { duration: 4000, horizontalPosition: 'start' },
        },
        { provide: MAT_DATE_LOCALE, useValue: 'fr-BE' },
        { provide: LOCALE_ID, useValue: 'fr-BE' },
        {
            provide: DateAdapter,
            useClass: CustomDateAdapter,
            deps: [MAT_DATE_LOCALE, Platform],
        },
    ],
    bootstrap: [AppRootComponent, AppComponent],
})
export class AppModule {}
