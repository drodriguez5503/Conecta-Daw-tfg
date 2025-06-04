import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Project } from '../../services/interfaces/project';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { CommonModule } from '@angular/common';
import { Note } from '../../services/interfaces/note';
import { NoteService } from '../../services/notes/note.service';

@Component({
	selector: 'ngbd-nav-dynamic',
	standalone: true,

	imports: [
		NgbNavModule,
		CommonModule,
		FormsModule 
	],
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.scss'],
	encapsulation: ViewEncapsulation.None,
	styles: `
		.close {
			font-size: 1.4rem;
			opacity: 0.1;
			transition: opacity 0.3s;
		}
		.nav-link:hover > .close {
			opacity: 0.8;
		}
	`,
})
export class NoteComponent implements OnInit {
	project: Project | null = null;
	isFolderPanelVisible = false;
	selectedNotes: Note[] = [];
	constructor( 
		private communicationService: ComunicationService,
		private noteService: NoteService
	) {
		
		this.navs.forEach(id => {
				this.notes[id] = { title: '', content: '' };
			});
	}
	navs: number[] = [];
	notes: { [id: number]: { title: string; content: string } } = {};
	active: number | null = null;

	ngOnInit(): void {
		// Restaurar estado de pestañas abiertas y activa desde localStorage
		const cachedNavs = localStorage.getItem('noteNavs');
		const cachedNotes = localStorage.getItem('noteNotes');
		const cachedActive = localStorage.getItem('noteActive');
		if (cachedNavs) {
			this.navs = JSON.parse(cachedNavs);
		}
		if (cachedNotes) {
			this.notes = JSON.parse(cachedNotes);
		}
		if (cachedActive) {
			this.active = +cachedActive;
		}

			const cached = localStorage.getItem('currentProject');
			if (cached && !this.project) {
			this.project = JSON.parse(cached);
			}

			this.communicationService.projectCom$.subscribe((project) => {
				if (project) this.project = project;
			});

			this.communicationService.isFolderPanelVisible$.subscribe((visible) => {
			this.isFolderPanelVisible = visible;
		});
			this.communicationService.noteSelected$.subscribe((note) => {
				if (!note || !note.id) return;
				if (this.navs.includes(note.id)) {
					this.active = note.id;
				} else {
					this.navs.push(note.id);
					this.notes[note.id] = { title: note.title, content: note.content };
					this.active = note.id;
				}
				this.saveTabsState();
	});
}

saveTabsState() {
	localStorage.setItem('noteNavs', JSON.stringify(this.navs));
	localStorage.setItem('noteNotes', JSON.stringify(this.notes));
	localStorage.setItem('noteActive', this.active !== null ? this.active.toString() : '');
}

	counter = this.navs.length + 1;

	close(event: MouseEvent, toRemove: number) {
		this.navs = this.navs.filter((id) => id !== toRemove);
		delete this.notes[toRemove];
		if (this.active === toRemove && this.navs.length) {
			this.active = this.navs[0];
		} else if (this.navs.length === 0) {
			this.active = null;
		}
		this.saveTabsState();
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	add(event: MouseEvent) {
		this.navs.push(this.counter);
		this.notes[this.counter] = { title: '', content: '' };
		this.counter++;
		if (!this.active) {
			this.active = this.navs[0];
		}
		this.saveTabsState();
		event.preventDefault();
	}

	// Guarda la nota (por ahora solo muestra un alert, puedes implementar persistencia real)
	saveNote(id: number) {
		const note = this.notes[id];
		if (note && this.project) {
			const noteToUpdate: Note = {
				id: id,
				title: note.title,
				content: note.content,
				project: this.project.id,
				author: 0, // Puedes ajustar esto si tienes el autor
				created_at: '', // Puedes omitir o ajustar si tienes la fecha
				updated_at: '',
				tags: []
			};
			this.noteService.updateNote(this.project, noteToUpdate).subscribe({
				next: () => {
					alert('Nota guardada correctamente');
				},
				error: () => {
					alert('Error al guardar la nota');
				}
			});
		}
	}
}

