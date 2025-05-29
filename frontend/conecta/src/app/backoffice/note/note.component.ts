import { Component, ViewEncapsulation } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@Component({
	selector: 'ngbd-nav-dynamic',
	standalone: true,
	imports: [NgbNavModule, FormsModule],
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
export class NoteComponent {
	navs = [1, 2, 3, 4, 5];
	counter = this.navs.length + 1;
	active: number = this.navs[0];

	notes: { [id: number]: { title: string; content: string } } = {};

	constructor() {
		// Inicializa una nota vacía para cada tab
		this.navs.forEach(id => {
			this.notes[id] = { title: '', content: '' };
		});
	}

	close(event: MouseEvent, toRemove: number) {
		this.navs = this.navs.filter((id) => id !== toRemove);
		delete this.notes[toRemove];
		if (this.active === toRemove && this.navs.length) {
			this.active = this.navs[0];
		}
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
		event.preventDefault();
	}

	// Guarda la nota (por ahora solo muestra un alert, puedes implementar persistencia real)
	saveNote(id: number) {
		const note = this.notes[id];
		if (note) {
			localStorage.setItem(`note_${id}`, JSON.stringify(note));
			alert('Nota guardada: ' + (note.title || 'Sin título'));
		}
	}
}