import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FolderPanelComponent } from '../folder-panel/folder-panel.component';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-options-sidebar',
  standalone: true,
  imports: [
    FolderPanelComponent,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './project-options-sidebar.component.html',
  styleUrl: './project-options-sidebar.component.scss'
})
export class ProjectOptionsSidebarComponent  {
  

    constructor(
      private router: Router,
      public comunicationService: ComunicationService
    ) {}
  
  navigateTo(route: string): void {
    this.router.navigate([route]); // Navega a la ruta especificada
  }

  toggleFolderPanel(): void {
    this.comunicationService.toggleFolderPanelVisibility(); // Llama al servicio para alternar el panel de carpetas
  }

  navigateToConections(): void {
  const currentProject = this.comunicationService.currentProject;

  if (currentProject) {
    // vuelve a enviar el proyecto por seguridad (aunque ya esté en el service)
    this.comunicationService.sendProject(currentProject);
    this.router.navigate(['/backoffice/conections']);
  } else {
    // Aquí podrías mostrar un error o redirigir al selector de proyectos
    console.warn("No hay un proyecto seleccionado para mostrar conexiones.");
  }
}
}


