import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

import {NavbarComponent} from "./navbar/navbar.component";
import {ErrorHandlerService} from "./error-handler.service";
import {LancamentoService} from "../lancamentos/lancamento.service";
import {PessoaService} from "../pessoas/pessoa.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import {Title} from "@angular/platform-browser";
import {AuthService} from "../seguranca/auth.service";
import { NaoAutorizadoComponent } from './nao-autorizado.component';




@NgModule({
  declarations: [NavbarComponent, PaginaNaoEncontradaComponent, NaoAutorizadoComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    RouterModule,
  ],
  exports: [
    NavbarComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [
    LancamentoService,
    PessoaService,

    ErrorHandlerService,
    DatePipe,
    MessageService,
    ConfirmationService,
    Title,
    AuthService,

    TranslateService,
    {provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class CoreModule { }
