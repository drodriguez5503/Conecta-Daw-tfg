import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CredentialsService } from '../../services/auth/credentials.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../../services/notes/project.service';
import { Project, ProjectCreate } from '../../services/interfaces/project';
import {ComunicationService} from '../../services/comunication/comunication.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { HostListener, ElementRef } from '@angular/core';


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
export class SidebarComponent implements OnInit, OnChanges {
  @Input() collapsed: boolean = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  showProjectForm: boolean = false;
  projectName: string = '';
  user: any ;
  projects: Project[] = [];
  showProjects: boolean = false;
  activeProject: Project | null = null;

constructor(
  private credentialsService: CredentialsService,
  private cd: ChangeDetectorRef,
  private projectService: ProjectService,
  private communicationService: ComunicationService,
  private router: Router,
  private eRef: ElementRef,
  
){}



async deleteProject(project: Project) {
  const result = await Swal.fire({
    title: `¿Eliminar "${project.name}"?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.activeProject = null;
        Swal.fire('Eliminado', 'El proyecto ha sido eliminado.', 'success');
      },
      error: (err) => {
        console.error('Error al eliminar proyecto', err);
        Swal.fire('Error', 'No se pudo eliminar el proyecto.', 'error');
      }
    });
  }
}


async addUserToProject(project: Project) {
  const { value: username } = await Swal.fire({
    title: 'Añadir usuario al proyecto',
    input: 'text',
    inputLabel: 'Nombre de usuario',
    inputPlaceholder: 'usuario123',
    showCancelButton: true,
    confirmButtonText: 'Buscar',
    cancelButtonText: 'Cancelar'
  });

  if (!username) return;

  try {
    const userResponse = await firstValueFrom(this.credentialsService.getUserByUserName(username));
    const user = userResponse.user;

    if (!user) {
      await Swal.fire('Usuario no encontrado', `No existe un usuario llamado "${username}".`, 'warning');
      return;
    }

    await firstValueFrom(this.projectService.addUserToProject(project, user.id));
    await Swal.fire('Añadido', `Usuario "${username}" fue añadido correctamente al proyecto.`, 'success');

    this.activeProject = null;

  } catch (error) {
    console.error('Error al añadir usuario al proyecto:', error);
    await Swal.fire('Error', 'No se pudo añadir el usuario al proyecto.', 'error');
  }
}

navigateToProfile() {
  this.communicationService.sendUser(this.user);
  this.router.navigate(['/backoffice/user']); // o la ruta que hayas definido
}

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

toggleSidebar() {
  this.collapsed = !this.collapsed;
  if (this.collapsed) {
    this.showProjects = false;
    // Si tienes otras carpetas o listas anidadas, ciérralas aquí también
  }
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['collapsed'] && changes['collapsed'].currentValue === true) {
    this.showProjects = false;
    // Si tienes otras carpetas/listas anidadas, ciérralas aquí también
  }
}

onProjectsIconClick() {
  if (this.collapsed) {
    this.collapsedChange.emit(false); // Pide al padre que abra el sidebar
    setTimeout(() => {
      this.showProjects = true;
    }, 250); // Espera a que el sidebar se expanda visualmente
  } else {
    this.toggleProjectsList();
  }
}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.eRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.activeProject = null;
    }
  }

toggleProjectMenu(project: Project) {
  if (this.activeProject === project) {
    this.activeProject = null;
  } else {
    this.activeProject = project;
  }
}



}
