import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'ngbd-nav-dynamic',
	standalone: true,
	imports: [NgbNavModule],
	templateUrl: './note.component.html',
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
close($event: MouseEvent,_t3: any) {
throw new Error('Method not implemented.');
}
add($event: MouseEvent) {
throw new Error('Method not implemented.');
}
active: any;
navs: any;

}
export class NgbdNavDynamic {
	navs = [1, 2, 3, 4, 5];
	counter = this.navs.length + 1;
	active: number | undefined;

	close(event: MouseEvent, toRemove: number) {
		this.navs = this.navs.filter((id) => id !== toRemove);
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	add(event: MouseEvent) {
		this.navs.push(this.counter++);
		event.preventDefault();
	}
}