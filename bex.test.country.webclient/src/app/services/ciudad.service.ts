import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Ciudad } from '../models/ciudad.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private apiUrl = `${environment.apiUrl}/ciudad`;
  constructor(private http: HttpClient) { }

    getAll(): Observable<Ciudad[]> {
      return this.http.get<any>(`${this.apiUrl}/GetAll`).pipe(
        map(respuesta => {
          if (respuesta.esExitoso && Array.isArray(respuesta.resultado)) {
            return respuesta.resultado;
          } else {
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error al obtener ciudades:', error);
          return throwError(() => error);
        })
      );
    }

    getById(id: number): Observable<Ciudad> {
      return this.http.get<any>(`${this.apiUrl}/GetById?ciudadId=${id}`).pipe(
        map(respuesta => {
          if (respuesta.esExitoso) {
            return respuesta.resultado;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error al obtener ciudades:', error);
          return throwError(() => error);
        })
      );
    }

    getByName(name: string): Observable<boolean> {
      return this.http.get<any>(`${this.apiUrl}/GetByNombre?nombreCiudad=${name}`).pipe(
        map(response => response.esExitoso)
      );
    }

    create(departamento: Ciudad): Observable<Ciudad> {
      return this.http.post<Ciudad>(`${this.apiUrl}/Create`, departamento);
    }

    update(departamento: Ciudad): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/Update`, departamento);
    }

    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/Delete?ciudadId=${id}`);
    }
}