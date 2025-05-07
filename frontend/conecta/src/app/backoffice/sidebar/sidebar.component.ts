import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() toggleFolderPanel = new EventEmitter<void>();

  emitToggleFolderPanel(): void {
    this.toggleFolderPanel.emit();
  }

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]); // Navega a la ruta especificada
  }
}