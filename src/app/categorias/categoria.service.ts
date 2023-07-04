import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriasUrl: string = '';
  constructor(private http: HttpClient) {
    this.categoriasUrl =   `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.categoriasUrl}`))
      .then(response => response)
  }
}
