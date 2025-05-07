import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridStack, GridStackOptions } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements AfterViewInit {
  @ViewChild('gridStackElement') gridStackElement!: ElementRef;
  private gridStack!: GridStack;
  gridItems: any[] = [
    { x: 1, y: 0, w: 2, h: 1, title: 'Nota Uno', content: 'Contenido de la nota 1' },
    { x: 1, y: 1, w: 2, h: 1, title: 'Segunda Nota', content: 'Texto de la nota 2' },
    { x: 3, y: 0, w: 2, h: 1, title: 'Tercera Idea', content: 'Detalles de la nota 3' },
    { x: 3, y: 1, w: 2, h: 1, title: 'Cuarta Reflexión', content: 'El contenido de la nota 4' }
  ];

  editingIndex: { [key: number]: boolean } = {};

  ngAfterViewInit(): void {
    const options: GridStackOptions = {};
    this.gridStack = GridStack.init(options, this.gridStackElement.nativeElement);
    this.loadGridItems();
  }

  loadGridItems(): void {
    this.gridStack.load(this.gridItems);
  }

  editNote(index: number): void {
    this.editingIndex = {}; // Cerrar cualquier otra nota que esté en edición
    this.editingIndex[index] = true;
  }

  saveNote(index: number): void {
    this.editingIndex[index] = false;
    // Aquí puedes añadir lógica para guardar los cambios en un servicio, base de datos, etc.
    console.log('Nota guardada:', this.gridItems[index]);
  }
}