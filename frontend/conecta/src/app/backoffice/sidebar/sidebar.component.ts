import { Component, Input, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CredentialsService } from '../../services/auth/credentials.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../../services/notes/project.service';
import { Project, ProjectCreate } from '../../services/interfaces/project';
import {ComunicationService} from '../../services/comunication/comunication.service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;
  showProjectForm: boolean = false;
  projectName: string = '';
  user: any ;
  projects: Project[] = [];
  showProjects: boolean = false;

constructor(
  private credentialsService: CredentialsService,
  private cd: ChangeDetectorRef,
  private projectService: ProjectService,
  private communicationService: ComunicationService,
  private router: Router
){}

navigateToProject(project: Project){
  this.communicationService.sendProject(project);
  this.router.navigate(['backoffice', 'note']);
}
 ngOnInit(): void {
      this.credentialsService.getUserInfo().subscribe({
      next: (data) => {
        this.user = data.user;
        console.log('Usuario cargado:', data);
        this.cd.detectChanges();
        this.loadProjects();
      },
      error: (err) => {
        console.error('Error al obtener el usuario', err);
      }
    });
 }

 loadProjects() {
  this.projectService.getProjects().subscribe({
    next: (projects) => {
      this.projects = projects;
      console.log('Proyectos cargados:', projects);
    },
    error: (err) => {
      console.error('Error al cargar proyectos', err);
    }
  });
}

toggleProjectForm() {
  this.showProjectForm = !this.showProjectForm;
  if (!this.showProjectForm) this.projectName = '';
}

  createProject() {
  const trimmedName = this.projectName.trim();

  if (trimmedName) {
    const newProject: ProjectCreate = {
      name: trimmedName,
    };

    this.projectService.createProject(newProject).subscribe({
      next: (response) => {
        console.log('Proyecto creado exitosamente:', response);
        this.toggleProjectForm(); // cierra el formulario
        this.projectName = '';    // limpia el campo
        // puedes emitir un evento o recargar la lista si estás mostrándola
      },
      error: (err) => {
        console.error('Error al crear proyecto', err);
      }
    });
  }
}

toggleProjectsList() {
  this.showProjects = !this.showProjects;

}
}
