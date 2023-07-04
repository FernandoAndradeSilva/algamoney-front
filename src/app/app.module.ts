import {NgModule  } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from "./core/core.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";

import localePt from '@angular/common/locales/pt';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core"
import {AppRoutingModule} from "./app-routing.module";
import {SegurancaModule} from "./seguranca/seguranca.module";

registerLocaleData(localePt);

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SegurancaModule,
    AppRoutingModule,

  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
