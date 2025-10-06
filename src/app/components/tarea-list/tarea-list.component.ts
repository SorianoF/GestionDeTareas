import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaService, PagedResult } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';
import { TareaFormComponent } from '../tarea-form/tarea-form.component';

@Component({
  selector: 'app-tarea-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TareaFormComponent, DatePipe],
  templateUrl: './tarea-list.component.html',
  styleUrls: ['./tarea-list.component.css'],
})
export class TareaListComponent implements OnInit {
  tareas: Tarea[] = [];
  filtro = '';
  cargando = false;
  error = '';
  page = 1;
  pageSize = 10;
  totalCount = 0;
  orderAsc = true;

  // Modal
  modalVisible = false;
  editarTarea?: Tarea;

  successMsg = '';
  private searchTimeout?: any;

  constructor(private tareaService: TareaService) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas() {
    this.cargando = true;
    this.error = '';
    this.tareaService.getAll(this.filtro.trim(), this.page, this.pageSize, this.orderAsc).subscribe({
      next: (res: PagedResult) => {
        this.tareas = res.items || [];
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.totalCount = res.totalCount;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar tareas.';
        this.cargando = false;
      },
    });
  }

  onSearchChange() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 1;
      this.cargarTareas();
    }, 300);
  }

  cambiarOrden() {
    this.orderAsc = !this.orderAsc;
    this.cargarTareas();
  }

  mostrarCrear() {
    this.editarTarea = undefined;
    this.modalVisible = true;
    this.successMsg = '';
  }

  mostrarEditar(t: Tarea) {
    this.editarTarea = t;
    this.modalVisible = true;
    this.successMsg = '';
  }

  onGuardado(msg = 'Guardado correctamente') {
    this.modalVisible = false;
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ''), 3000);
    this.cargarTareas();
  }

  marcarCompletada(t: Tarea) {
    this.cargando = true;
    this.tareaService.marcarCompletada(t.id).subscribe({
      next: () => this.cargarTareas(),
      error: () => {
        this.error = 'Error al marcar como completada.';
        this.cargando = false;
      },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    this.cargando = true;
    this.tareaService.delete(id).subscribe({
      next: () => this.cargarTareas(),
      error: () => {
        this.error = 'Error al eliminar.';
        this.cargando = false;
      },
    });
  }

  paginaAnterior() {
    if (this.page > 1) {
      this.page--;
      this.cargarTareas();
    }
  }

  paginaSiguiente() {
    const maxPage = Math.ceil(this.totalCount / this.pageSize);
    if (this.page < maxPage) {
      this.page++;
      this.cargarTareas();
    }
  }

  prioridadTexto(p: number) {
    return p === 2 ? 'Alta' : p === 1 ? 'Media' : 'Baja';
  }

  estadoTexto(e: number) {
    return e === 1 ? 'Completada' : 'Pendiente';
  }
}