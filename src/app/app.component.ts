import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  //variáveis
  apiUrl: string = 'http://localhost:8081/api/clientes';
  clientes: any[] = [];

  //Método construtor
  constructor(
    private httpClient: HttpClient
  ) {
  }

  //objeto para desenvolver o formulário
  formCadastro = new FormGroup({

    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });

  //objeto para desenvolver o formulário de edição
  formEdicao= new FormGroup({
    idCliente: new FormControl(''),
    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])

  });

  //Função para verificar se os campos do formulário estão com erro de validação 
  //e exibir uma mensagem de erro
  get fCadastro() {
    return this.formCadastro.controls;
  }

  //criar função para verificar se os campos de edição estão com erro de validação e exibir a mensagem
  get fEdicao(){
    return this.formEdicao.controls; //vou devolver todos os campos da edição (verificar se tem algo escrito errado)
  }

  //Método executado quando a página abrir
  ngOnInit(): void {

    //fazendo uma requisição GET para api de consulta de clientes
    this.httpClient.get(this.apiUrl + '/consultar')
      .subscribe({ //capturando o retorno da API (resposta)
        next: (data) => {
          //armazenar os dados obtidos da API
          this.clientes = data as any[];
        }
      })
  }

  //Método para ser executado no SUBMIT do formulário (depois que aperto o botão de cadastrar cliente)
  cadastrarCliente(): void {
    //fazer uma chamada/requisição POST para Api de cliente
    this.httpClient.post(this.apiUrl + '/criar', this.formCadastro.value, { responseType: 'text' })
      .subscribe({//capturando o retorno da API (resposta)
        next: (data) => {

          this.formCadastro.reset();
          this.ngOnInit(); //executando a consulta novamente apos cadastrar o cliente
          alert(data);//exibindo a mensagem
        }
      })
  }

  //metodo para ser executado ao clicar no botão de Excluir
  excluirCliente(idCliente: string): void{
    if(confirm('Deseja realmente excluir o cliente selecionado?')){
      //enviar para api excluir o cliente para chamar api usa biblioteca http client
      this.httpClient.delete(this.apiUrl + "/excluir/" + idCliente, {responseType: 'text'})

      //fiz a chamada, agora a api tem q me dar o retorno
      .subscribe({
        next: (data) => { //recebendo a mensagem de sucesso da api
          this.ngOnInit();
          alert(data);//exibindo a mensagem
          //pronto eu exclui, agora tenho q fazer uma nova consulta pra ele sumir da minha pagina por isso coloquei 
          //o ngOnInit para fazer a consuta novamente antes do alert
        }
      })

    }
  }

  //criar um método para capturar o cliente selecionado na tela e exibir seus dados no formulario de edição
  obterCliente(c: any): void{ //any quer dizer que c tem um objeto tipo QUALQUER
    //agora com esse objeto eu vou preencher todos os campos da tela de edição
    this.formEdicao.controls['idCliente'].setValue(c.idCliente);
    this.formEdicao.controls['nomeCliente'].setValue(c.nomeCliente);
    this.formEdicao.controls['emailCliente'].setValue(c.emailCliente);
    this.formEdicao.controls['telefoneCliente'].setValue(c.telefoneCliente);


  }

  //criar um método para enviar o ENDPOINT para edição da API
  atualizarCliente():void{

    this.httpClient.put(this.apiUrl + "/editar", this.formEdicao.value, {responseType: 'text'})
    .subscribe({
      next: (data) =>{
        this.ngOnInit();
        alert(data);
      }
    })
  }
}
