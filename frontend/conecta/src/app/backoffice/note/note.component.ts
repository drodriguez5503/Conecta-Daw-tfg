import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridStack, GridStackOptions } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'] 
})
export class NoteComponent implements AfterViewInit {
  @ViewChild('gridStackElement') gridStackElement!: ElementRef;
  private gridStack!: GridStack;
  gridItems: any[] = [
    { x: 1, y: 0, w: 2, h: 1, content: 'Nota 1' },
    { x: 1, y: 0, w: 2, h: 1, content: 'Nota 2' },
    { x: 1, y: 0, w: 2, h: 1, content: 'Nota 3' },
    { x: 1, y: 0, w: 2, h: 1, content: 'Nota 4' }
  ];

  ngAfterViewInit(): void {
    const options: GridStackOptions = {};
    this.gridStack = GridStack.init(options, this.gridStackElement.nativeElement);
    this.loadGridItems();
  }

  loadGridItems(): void {
    this.gridStack.load(this.gridItems);
  }
}