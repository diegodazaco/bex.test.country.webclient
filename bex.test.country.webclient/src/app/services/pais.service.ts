import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pais } from '../models/pais.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaisService {
  private apiUrl = `${environment.apiUrl}/pais`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pais[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAll`).pipe(
      map(respuesta => {
        if (respuesta.esExitoso && Array.isArray(respuesta.resultado)) {
          return respuesta.resultado;
        } else {
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error al obtener países:', error);
        return throwError(() => error);
      })
    );
  }

  getById(id: number): Observable<Pais> {
    return this.http.get<any>(`${this.apiUrl}/GetById?paisId=${id}`).pipe(
      map(respuesta => {
        if (respuesta.esExitoso) {
          return respuesta.resultado;
        } else {
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error al obtener países:', error);
        return throwError(() => error);
      })
    );
  }

  getByName(name: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/GetByNombre?nombrePais=${name}`).pipe(
      map(response => response.esExitoso)
    );
  }

  create(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(`${this.apiUrl}/Create`, pais);
  }

  update(pais: Pais): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Update`, pais);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete?paisId=${id}`);
  }
}