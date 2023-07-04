import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Pessoa} from "../../core/model";
import {PessoaService} from "../pessoa.service";
import {MessageService} from "primeng/api";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa: Pessoa  = new Pessoa();
  constructor(private pessoaService: PessoaService,
              private messageService: MessageService,
              private errorHandler: ErrorHandlerService,
              private title: Title,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit(): void {

    this.title.setTitle('Cadastro de pessoa');
    const codigoPessoa = this.route.snapshot.params['codigo'];

    if(codigoPessoa) {
      this.carregaPessoa(codigoPessoa);
      this.atualizarTituloEdicao();
    }

  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  salvar(pessoaForm: NgForm) {

    if(this.editando) {
      this.atualizarPessoa();
    } else {
      this.salvarPessoa(pessoaForm)
    }

  }

  salvarPessoa(pessoaForm: NgForm) {
    this.pessoaService.adicionar(this.pessoa)
      .then(() => {
        this.messageService.add({severity: 'success', detail: 'Pessoa adicionada!'})
        pessoaForm.reset();
        this.pessoa = new Pessoa();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

   carregaPessoa(codigoPessoa: any) {
    this.pessoaService.buscarPorCodigo(codigoPessoa)
      .then((pessoa: Pessoa) => {
        this.pessoa = pessoa;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

   atualizarPessoa() {
    this.pessoaService.atualizar(this.pessoa)
      .then((pessoa: Pessoa) => {
        this.messageService.add({severity: 'success', detail: 'Pessoa atulizada!'})
        this.pessoa = pessoa;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTituloEdicao() {
    this.title.setTitle('Edição de pessoa')
  }


  novo(pessoaForm: NgForm) {

    pessoaForm.reset();

    setTimeout(() => {
      this.pessoa = new Pessoa();
    }, 1)

    this.router.navigate(['/pessoas/novo'])
  }
}
