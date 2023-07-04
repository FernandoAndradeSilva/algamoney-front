import { Component, OnInit } from '@angular/core';
import {CategoriaService} from "../../categorias/categoria.service";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {PessoaService} from "../../pessoas/pessoa.service";
import {Lancamento} from "../../core/model";
import {NgForm} from "@angular/forms";
import {LancamentoService} from "../lancamento.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit{

  categorias = [ ];
  pessoas = [ ];
  tipos = [
    { label: 'Receita', value: 'RECEITA'},
    { label: 'Despesa', value: 'DESPESA'}
  ];

  lancamento= new Lancamento();


  constructor(private categoriaService: CategoriaService,
              private pessoaService: PessoaService,
              private errorHandler: ErrorHandlerService,
              private lancamentoService: LancamentoService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title) {  }

  ngOnInit(): void {
    this.title.setTitle('Cadastro de lançamento');
    const codigoLancamento = this.route.snapshot.params['codigo'];

    if(codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
      this.atualizarTituloEdicao();
    }

    this.carregaCategorias();
    this.carregaPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregaCategorias() {
    this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map((c:any) => {
          return { label: c.nome , value: c.codigo }
        });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregaPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map((c:any) => {
          return { label: c.nome , value: c.codigo }
        });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(lancamentoForm: NgForm) {
    if(this.editando) {
      this.atualizarLancamento()
    } else {
      this.adicionarLancamento(lancamentoForm)
    }
  }

  adicionarLancamento(lancamentoForm: NgForm) {
    this.lancamentoService.adicionar(this.lancamento)
      .then((lancamento: Lancamento) => {
        this.messageService.add({severity: 'success', detail: 'Lançamento adicionado!'})

        this.router.navigate(['/lancamentos',lancamento.codigo])
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.lancamento)
      .then((lancamento: Lancamento) => {
        this.messageService.add({severity: 'success', detail: 'Lançamento atualizado!'})
        this.lancamento = lancamento;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(lancamentoForm: NgForm) {
    lancamentoForm.reset();

    setTimeout(() => {
      this.lancamento = new Lancamento();
    }, 1);

    this.lancamento = new Lancamento();
    this.router.navigate(['/lancamentos/novo'])
  }

  atualizarTituloEdicao() {
    this.title.setTitle('Edição de lançamento')
  }


}
