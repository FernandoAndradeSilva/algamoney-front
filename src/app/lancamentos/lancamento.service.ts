import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {DatePipe} from "@angular/common";
import {Lancamento} from "../core/model";
import {environment} from "../../environments/environment";


export class LancamentoFilter {
  descricao?: string;
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl: string = '';
  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
    this.lancamentosUrl =   `${environment.apiUrl}/lancamentos`;

  }
  pesquisar(filtro: LancamentoFilter): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina);
    params = params.set('size', filtro.itensPorPagina);

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if(filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!);
    }

    if(filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!);
    }

    return firstValueFrom(this.http.get(`${this.lancamentosUrl}?resumo`,
      {params}))
      .then((response: any) => {

        return {
          lancamentos: response.content,
          total: response.totalElements,
        };


      });
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.lancamentosUrl}/${codigo}`))
      .then(() => null)
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return firstValueFrom( this.http.post<Lancamento>(this.lancamentosUrl, lancamento,
      )).then(response => response)
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return firstValueFrom(this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento))
      .then(response => {
        this.converterStringsParaDatas([response])
        return response;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return firstValueFrom(this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}` ))
      .then(response => {
        this.converterStringsParaDatas([response])
        return response;
      })
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).getTime() + offset);
      }
    }
  }
}
