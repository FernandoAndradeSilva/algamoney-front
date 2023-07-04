import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Pessoa} from "../core/model";
import {environment} from "../../environments/environment";

export class PessoaFilter {
  nome?: string;
  pagina = 0;
  itensPorPagina = 5;
}


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoasUrl: string = '';
  constructor(private http: HttpClient) {
    this.pessoasUrl =   `${environment.apiUrl}/pessoas`;
  }

  pesquisar(filtro: PessoaFilter) {

    let params = new HttpParams();

    params = params.set('page', filtro.pagina);
    params = params.set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return firstValueFrom(this.http.get(`${this.pessoasUrl}`,
      {params}))
      .then((response: any) => {
        return {
          pessoas: response.content,
          total: response.totalElements,
        };
      });

  }

  listarTodas():Promise<any> {
    return firstValueFrom(this.http.get(`${this.pessoasUrl}`))
      .then((response: any) => response.content)

  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.pessoasUrl}/${codigo}`))
      .then(() => null)
  }

  alterarStatus(codigo: number , ativo: boolean) {
    return firstValueFrom(this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo))
      .then(() => null)

  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return firstValueFrom(this.http.post<Pessoa>(this.pessoasUrl, pessoa))
      .then(response => response);

  }

  atualizar(pessoa: Pessoa) {
    return firstValueFrom(this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa ))
      .then(response => response)
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return firstValueFrom(this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`))
      .then(response => response);

  }



}
