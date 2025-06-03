import {Component, HostListener, OnInit, Renderer2} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Project } from '../../services/interfaces/project';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { NoteService } from '../../services/notes/note.service';
import { NoteCreate } from '../../services/interfaces/note';

@Component({
  selector: 'app-folder-panel',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './folder-panel.component.html',
  styleUrl: './folder-panel.component.scss'
})
export class FolderPanelComponent implements OnInit {
  newNoteTitle = '';
  currentProject: Project | null = null;
  showNoteModal = false;
  private resizing = false;
  notes: Array<{ name: string; editing: boolean }> = [];

  constructor(
    private renderer: Renderer2,
    private comunicationService: ComunicationService,
    private noteService: NoteService
  ) {
    this.loadNotes();
    this.loadNotesFromAPI();
  }

   ngOnInit() {
    this.comunicationService.projectCom$.subscribe((project) => {
      this.currentProject = project;
      this.loadNotesFromAPI();
    });

    if(!this.currentProject){
      this.currentProject = this.comunicationService.currentProject;
    }
  }

 addNote1() {
  this.newNoteTitle = '';
  this.showNoteModal = true;
}

cancelNoteCreation() {
  this.showNoteModal = false;
}

confirmCreateNote() {
  if (!this.newNoteTitle.trim() || !this.currentProject) return;

  const newNote = {
    title: this.newNoteTitle,
    project: this.currentProject.id,
    content: '.',
  };
  console.log('📦 Payload enviado a la API:', newNote);
  this.noteService.createNote(this.currentProject, newNote).subscribe({
    next: (createdNote) => {
      this.notes.push(createdNote);
      this.saveNotes();
      this.showNoteModal = false;
    },
    error: (err) => {
      console.error('Error al crear la nota', err);
    }
  });
}
loadNotesFromAPI() {
  if (!this.currentProject) return;
  this.noteService.getNotesInProject(this.currentProject).subscribe({
    next: (notesFromApi) => {
      this.notes = notesFromApi.map((note: any) => ({
        ...note,
        name: note.title,
        editing: false
      }));
      this.saveNotes();
    },
    error: (err: any) => {
      console.error('Error al cargar las notas desde la API', err);
      this.loadNotes();
    }
  });
}

selectNote(note: any) {
  this.comunicationService.selectNote(note);
  console.log('📄 Nota clicada:', note);
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


  saveNotes() {
    localStorage.setItem('folderPanelNotes', JSON.stringify(this.notes));
  }

  startResizing(event: MouseEvent) {
    this.resizing = true;
    this.renderer.addClass(document.body, 'resizing');
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.resizing) return;

    const newWidth = event.clientX - 80;
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

  async deleteNote(index: number, note:any) {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (this.currentProject) {
          this.noteService.deleteNote(this.currentProject, note).subscribe({
            next: (data) => {
              console.log('Nota eliminada:', data);
            },
            error: (err) => {
              console.error('Error al eliminar la nota', err);
            }
          })
        }
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
