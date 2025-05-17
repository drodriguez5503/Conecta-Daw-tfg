import { Component, HostListener, Renderer2 } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-folder-panel',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './folder-panel.component.html',
  styleUrl: './folder-panel.component.scss'
})
export class FolderPanelComponent {
  private resizing = false;

  notes: Array<{ name: string; editing: boolean }> = [];

  constructor(private renderer: Renderer2) {}

  startResizing(event: MouseEvent) {
    this.resizing = true;
    this.renderer.addClass(document.body, 'resizing');
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.resizing) return;

    const newWidth = event.clientX - 80; // 80 = sidebar width
    const min = 200;
    const max = 600;
    const width = Math.max(min, Math.min(max, newWidth));

    document.documentElement.style.setProperty('--panel-width', `${width}px`);
  }

  @HostListener('document:mouseup')
  stopResizing() {
    if (this.resizing) {
      this.resizing = false;
      this.renderer.removeClass(document.body, 'resizing');
    }
  }

  addNote() {
    this.notes.push({ name: '', editing: true });
    setTimeout(() => {
      const inputs = document.querySelectorAll('.note-input');
      if (inputs.length) {
        (inputs[inputs.length - 1] as HTMLInputElement).focus();
      }
    });
  }

  editNote(index: number) {
    this.notes[index].editing = true;
    setTimeout(() => {
      const inputs = document.querySelectorAll('.note-input');
      if (inputs[index]) {
        (inputs[index] as HTMLInputElement).focus();
      }
    });
  }

  saveNote(index: number) {
    this.notes[index].editing = false;
    // Aquí podrías guardar en backend si lo necesitas
  }

  deleteNote(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.notes.splice(index, 1);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        });
      }
    });
  }
}
