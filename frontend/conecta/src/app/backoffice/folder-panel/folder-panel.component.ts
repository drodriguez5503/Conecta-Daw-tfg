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

  constructor(private renderer: Renderer2) {
    this.loadNotes();
  }

  loadNotes() {
    const notesJson = localStorage.getItem('folderPanelNotes');
    if (notesJson) {
      try {
        this.notes = JSON.parse(notesJson);
      } catch (e) {
        this.notes = [];
      }
    }
  }

  //las notas se guardan en el folder-panel
  // y se guardan en el localStorage
  saveNotes() {
    localStorage.setItem('folderPanelNotes', JSON.stringify(this.notes)); // Guardar en localStorage 
  }

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
    this.saveNotes();
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
    this.saveNotes();
  }

  deleteNote(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      html: '<span style="color:rgb(255, 255, 255);">You won\'t be able to revert this!</span>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal2-container--folder-panel',
        popup: 'swal2-popup',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        title: 'swal2-title'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.notes.splice(index, 1);
        this.saveNotes();
        Swal.fire({
          title: 'Deleted!',
          html: '<span style="color:rgb(255, 255, 255);">Your file has been deleted.</span>',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal2-container--folder-panel',
            popup: 'swal2-popup',
            confirmButton: 'swal2-confirm',
            title: 'swal2-title'
          }
        });
      }
    });
  }
}
