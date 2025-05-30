import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../../services/interfaces/project';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { CommonModule } from '@angular/common';
import { Note } from '../../services/interfaces/note';


@Component({
	selector: 'ngbd-nav-dynamic',
	standalone: true,
	imports: [
		NgbNavModule,
		CommonModule
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
		private communicationService: ComunicationService
	) {}
	ngOnInit(): void {
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
			console.log('📄 Nota recibida:', note);
    	const alreadyExists = this.selectedNotes.some(n => n.id === note.id);
   	 	if (!alreadyExists) {
      	this.selectedNotes.push(note);
		console.log('✅ Notas seleccionadas:', this.selectedNotes);
    	} else {
      	console.log('⚠️ Nota ya seleccionada:', note.title);
    	}
	});
}




	navs = [1, 2, 3, 4, 5];
	counter = this.navs.length + 1;
	active: number = this.navs[0];

	close(event: MouseEvent, toRemove: number) {
		this.navs = this.navs.filter((id) => id !== toRemove);
		if (this.active === toRemove && this.navs.length) {
			this.active = this.navs[0];
		}
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	add(event: MouseEvent) {
		this.navs.push(this.counter++);
		if (!this.active) {
			this.active = this.navs[0];
		}
		event.preventDefault();
	}
}