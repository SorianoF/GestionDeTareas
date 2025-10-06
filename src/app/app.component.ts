import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareaListComponent } from './components/tarea-list/tarea-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TareaListComponent],
  template: `<app-tarea-list></app-tarea-list>`
})
export class AppComponent {} 