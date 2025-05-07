import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { departamento } from '../models/departamento.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = `${environment.apiUrl}/departamento`;
  constructor(private http: HttpClient) { }

    getAll(): Observable<departamento[]> {
      return this.http.get<any>(`${this.apiUrl}/GetAll`).pipe(
        map(respuesta => {
          if (respuesta.esExitoso && Array.isArray(respuesta.resultado)) {
            return respuesta.resultado;
          } else {
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error al obtener departamentos:', error);
          return throwError(() => error);
        })
      );
    }

    getById(id: number): Observable<departamento> {
      return this.http.get<any>(`${this.apiUrl}/GetById?departamentoId=${id}`).pipe(
        map(respuesta => {
          if (respuesta.esExitoso) {
            return respuesta.resultado;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error al obtener departamentos:', error);
          return throwError(() => error);
        })
      );
    }
    
    getByName(name: string): Observable<boolean> {
      return this.http.get<any>(`${this.apiUrl}/GetByNombre?nombreDepartamento=${name}`).pipe(
        map(response => response.esExitoso)
      );
    }

    create(departamento: departamento): Observable<departamento> {
      return this.http.post<departamento>(`${this.apiUrl}/Create`, departamento);
    }

    update(departamento: departamento): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/Update`, departamento);
    }

    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/Delete?departamentoId=${id}`);
    }
}
