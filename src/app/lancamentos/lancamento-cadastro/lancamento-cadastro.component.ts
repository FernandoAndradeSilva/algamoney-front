import { Component, OnInit } from '@angular/core';
import {CategoriaService} from "../../categorias/categoria.service";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {PessoaService} from "../../pessoas/pessoa.service";
import {Lancamento} from "../../core/model";
import {FormGroup, NgForm, FormBuilder, Validators, FormControl} from "@angular/forms";
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

  formulario!: FormGroup

  constructor(private categoriaService: CategoriaService,
              private pessoaService: PessoaService,
              private errorHandler: ErrorHandlerService,
              private lancamentoService: LancamentoService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private formBuilder: FormBuilder)  {  }

  ngOnInit(): void {
    this.title.setTitle('Cadastro de lançamento');
    const codigoLancamento = this.route.snapshot.params['codigo'];

    if(codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
      this.atualizarTituloEdicao();
    }

    this.carregaCategorias();
    this.carregaPessoas();
    this.cofigurarFormulario();
  }

  cofigurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required ],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarRequired, Validators.minLength(5)]],
      valor: [null, Validators.required],
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: [],

      }),
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: [],
      }),
      observacao: [],
    })
  }

  validarRequired(input: FormControl) {
    return (input.value ? null : {obrigatoriedade: true})
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : {tamanhoMinino: {tamanho: valor}}
    }
  }

  get editando() {
    return Boolean(this.formulario.get('codigo')?.value)
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.formulario.patchValue(lancamento)

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario?.value)
      .then((lancamento: Lancamento) => {
        this.messageService.add({severity: 'success', detail: 'Lançamento adicionado!'})

        this.router.navigate(['/lancamentos',lancamento.codigo])
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario?.value)
      .then((lancamento: Lancamento) => {
        this.formulario.patchValue(lancamento)
        this.messageService.add({severity: 'success', detail: 'Lançamento atualizado!'})

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

  salvar() {
    if(this.editando) {
      this.atualizarLancamento()
    } else {
      this.adicionarLancamento()
    }
  }

  novo() {
    this.formulario.reset();
    this.formulario.patchValue(new Lancamento())
    this.router.navigate(['lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle('Edição de lançamento')
  }


}
