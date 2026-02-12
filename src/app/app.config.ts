import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';
import {registerLocaleData} from '@angular/common';
import localePl from '@angular/common/locales/pl';
import {CookieService} from 'ngx-cookie-service';
import {Title, Meta} from '@angular/platform-browser';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';

registerLocaleData(localePl); // Rejestracja globalna

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        CookieService,
        Title,
        Meta,
        {provide: LOCALE_ID, useValue: 'pl-PL'} // Ustawienie domyślnego locale
    ]
};
