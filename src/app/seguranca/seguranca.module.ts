import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginFormComponent} from "./login-form/login-form.component";
import {SegurancaRoutingModule} from "./seguranca.routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {JwtModule, JwtHelperService} from "@auth0/angular-jwt";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {MoneyHttpInterceptor} from "./money-http-interceptor";
import {AuthGuard} from "./auth.guard";
import {environment} from "../../environments/environment";


export function tokenGetter(): string {
  return localStorage.getItem('token')!;
}

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenAllowedDomains,
        disallowedRoutes: environment.tokenDisallowedRoutes
      }
    }),

    InputTextModule,
    CommonModule,
    SegurancaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoneyHttpInterceptor,
      multi: true
    },
    AuthGuard,
  ]
})
export class SegurancaModule {

}
