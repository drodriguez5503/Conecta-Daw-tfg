import { Component, ViewEncapsulation } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'ngbd-nav-dynamic',
	standalone: true,
	imports: [NgbNavModule],
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