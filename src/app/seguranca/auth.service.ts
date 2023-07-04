import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokensRevokeUrl = environment.apiUrl + '/tokens/revoke';
  oauthTokenUrl = environment.apiUrl + '/oauth/token'
  jwtPayload: any;

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService) {
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return firstValueFrom(this.http.post(this.oauthTokenUrl, body, {headers, withCredentials: true}))
      .then((response: any) => {
        this.armazenarToken(response['access_token']);
      })
      .catch(response => {

        if (response.status === 400) {
          if (response.error?.error === "invalid_grant") {
            return Promise.reject('Usuário ou senha inválida');
          }
        }

        return Promise.reject(response);

      })
  }


  armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }

  obterNovoAccessToken(): Promise<void | null> {

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')

    const body = 'grant_type=refresh_token';

    return firstValueFrom(this.http.post(this.oauthTokenUrl, body, {headers, withCredentials: true}))
      .then((response: any) => {
        this.armazenarToken(response['access_token']);
      }).catch(response => {
        console.log('Erro ao renovar token', response);
        return Promise.resolve(null)
      })
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;

  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles: any[]) {

    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  logout() {
    return firstValueFrom(this.http.delete(this.tokensRevokeUrl, {withCredentials: true})
    ).then(() => {
        this.limparAccessToken();
      });
  }

}
