import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Tarea } from '../models/tarea.model';

export interface PagedResult {
  items: Tarea[];
  page: number;
  pageSize: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'https://localhost:7064/api/Tareas'; 

  constructor(private http: HttpClient) {}

  getAll(search = '', page = 1, pageSize = 10, orderAsc = true): Observable<PagedResult> {
    let params = new HttpParams()
      .set('search', search ?? '')
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('orderAsc', String(orderAsc));
    return this.http.get<PagedResult>(this.apiUrl, { params });
  }

  getById(id: number) {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  create(tarea: Partial<Tarea>) {
    // Only send allowed fields (backend expects CreateTareaDto)
    const payload: any = {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? null,
      fechaLimite: tarea.fechaLimite ?? null,
      prioridad: tarea.prioridad ?? 1
    };
    return this.http.post<Tarea>(this.apiUrl, payload);
  }

  update(id: number, tarea: Partial<Tarea>) {
    // Update expects UpdateTareaDto: id, titulo, descripcion, fechaLimite, prioridad?, estado?
    const payload: any = {
      id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? null,
      fechaLimite: tarea.fechaLimite ?? null,
      prioridad: tarea.prioridad,
      estado: tarea.estado
    };
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Mark complete: GET current tarea, set estado = 1, PUT back
  marcarCompletada(id: number) {
    return this.getById(id).pipe(
      switchMap(t => {
        const payload: any = {
          id: t.id,
          titulo: t.titulo,
          descripcion: t.descripcion ?? null,
          fechaLimite: t.fechaLimite ?? null,
          prioridad: t.prioridad,
          estado: 1 // Completada
        };
        return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
      })
    );
  }
}