import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})
export class TareaFormComponent implements OnInit {
  @Input() tarea?: Tarea | undefined; // si viene, edición
  @Output() guardado = new EventEmitter<string>(); // emite mensaje de éxito / '' para cerrar

  form!: FormGroup;
  cargando = false;
  error = '';

  prioridades = [
    { value: 0, text: 'Baja' },
    { value: 1, text: 'Media' },
    { value: 2, text: 'Alta' },
  ];

  constructor(private fb: FormBuilder, private tareaService: TareaService) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(2000)]],
      fechaLimite: [''],
      prioridad: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.tarea) {
      // patch form with incoming tarea; format fechaLimite to yyyy-MM-dd if present
      this.form.patchValue({
        titulo: this.tarea.titulo,
        descripcion: this.tarea.descripcion ?? '',
        fechaLimite: this.tarea.fechaLimite ? this.tarea.fechaLimite.substring(0,10) : '',
        prioridad: this.tarea.prioridad
      });
    }
  }

  // getter para usar en TS si necesitas: this.getControl('titulo')
  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  // NOTA: en la plantilla usamos f['campo'] para que el template type checker no se queje.
  get f(): { [key: string]: AbstractControl | null } {
    return this.form.controls as { [key: string]: AbstractControl | null };
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.error = '';

    const dto: Partial<Tarea> = {
      titulo: this.f['titulo']?.value,
      descripcion: this.f['descripcion']?.value || null,
      fechaLimite: this.f['fechaLimite']?.value ? this.f['fechaLimite']?.value : null,
      prioridad: Number(this.f['prioridad']?.value)
    };

    if (this.tarea && this.tarea.id) {
      // Mantener estado actual (no lo cambiamos aquí)
      dto.estado = this.tarea.estado;
      this.tareaService.update(this.tarea.id, dto).subscribe({
        next: () => {
          this.cargando = false;
          this.guardado.emit('Actualizado correctamente');
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al actualizar la tarea.';
          this.cargando = false;
        }
      });
    } else {
      this.tareaService.create(dto).subscribe({
        next: () => {
          this.cargando = false;
          this.form.reset();
          this.form.patchValue({ prioridad: 1 });
          this.guardado.emit('Creado correctamente');
        },
        error: (err) => {
          console.error(err);
          // Si backend devuelve validaciones, intenta mostrarlas:
          if (err?.error?.message) this.error = err.error.message;
          else this.error = 'Error al crear la tarea.';
          this.cargando = false;
        }
      });
    }
  }

  cancelar() {
    // Emitimos string vacío para que el padre cierre el formulario sin mensaje
    this.guardado.emit('');
  }
}