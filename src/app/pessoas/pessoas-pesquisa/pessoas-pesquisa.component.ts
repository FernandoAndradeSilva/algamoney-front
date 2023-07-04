import {Component, ViewChild} from '@angular/core';
import {PessoaFilter, PessoaService} from "../pessoa.service";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {Table} from "primeng/table";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent {

  @ViewChild('tabela') grid!: Table;

  totalRegistros = 0;
  filtro = new PessoaFilter();
  pessoas = [];
  constructor(private pessoaService: PessoaService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = (event.rows!) / (event.first!);
    this.pesquisar(pagina);
  }

  excluir(pessoa: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.confirmarExclusao(pessoa);
      }
    })
  }

  confirmarExclusao(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        this.grid.reset();
        this.messageService.add({severity: 'success', detail: 'Pessoa excluída com sucesso!'})
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alterarStatus(pessoa: any) {
    this.pessoaService.alterarStatus(pessoa.codigo, !pessoa.ativo)
      .then(() => {
        this.grid.reset()
        this.messageService.add({
          severity: 'success',
          detail: `Pessoa ${!pessoa.ativo ? 'Ativada' : 'Desativada'} com sucesso`})
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
