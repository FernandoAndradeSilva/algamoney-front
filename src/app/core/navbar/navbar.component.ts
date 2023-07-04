import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../seguranca/auth.service";
import {ErrorHandlerService} from "../error-handler.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu: boolean = false;
  usuarioLogado: string = ''

  constructor(private auth: AuthService,
              private errorHandler: ErrorHandlerService,
              private router: Router) { }

  ngOnInit() {
    this.usuarioLogado = this.auth.jwtPayload?.nome;
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login'])

      })
      .catch(erro => this.errorHandler.handle(erro))
  }

}
