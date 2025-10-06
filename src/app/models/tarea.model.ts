export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  fechaLimite?: string | null;
  prioridad: number; // 0 = Baja, 1 = Media, 2 = Alta
  estado: number;    // 0 = Pendiente, 1 = Completada
  fechaCreacion: string;
}