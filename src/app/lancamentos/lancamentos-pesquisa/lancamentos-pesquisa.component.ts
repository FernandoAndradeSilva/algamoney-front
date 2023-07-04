import {Component, OnInit, ViewChild} from '@angular/core';
import {LancamentoFilter, LancamentoService} from "../lancamento.service";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {Table} from "primeng/table";
import {formatCurrency} from "@angular/common";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../seguranca/auth.service";

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit{

  @ViewChild('tabela') grid!: Table;

  totalRegistros = 0;
  filtro = new LancamentoFilter();
  lancamentos = [];

  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title ,
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Pesquisa de lançamentos');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = (event.rows!) / (event.first!);
    this.pesquisar(pagina);
  }

  excluir(lancamento: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.confirmarExclusao(lancamento);
      }
    })
  }

  confirmarExclusao(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.reset();
        this.messageService.add({severity: 'success', detail: 'Lançamento excluído com sucesso!'})
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }


}
