import { Component, OnInit } from '@angular/core';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { Project } from '../../services/interfaces/project';
import { ProjectService } from '../../services/notes/project.service';
import { UserInterface } from '../../services/interfaces/user-interface';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit {

  projects: Project[] = [];
  user: UserInterface | null = null;
  constructor(
    private comunicationService: ComunicationService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
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

  

}
