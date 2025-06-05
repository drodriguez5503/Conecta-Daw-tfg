import { Component, OnInit } from '@angular/core';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { Project } from '../../services/interfaces/project';
import { ProjectService } from '../../services/notes/project.service';
import { UserInterface } from '../../services/interfaces/user-interface';
import { NoteService } from '../../services/notes/note.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit {

  projects: Project[] = [];
  user: UserInterface | null = null;
  project: Project | null = null;

  
  constructor(
    private comunicationService: ComunicationService,
    private projectService: ProjectService,
    private noteService: NoteService,
    
  ) { }

  ngOnInit(): void {

  this.projectService.getProjects().subscribe({
    next: (projects) => {
    this.projects = projects;
    console.log('AQUI:', projects);
    },
    error: (err) => {
      console.error('Error al cargar proyectos', err);
    }
  });
  // if (this.projects.length > 0) {
  //   this.getNotes(this.project);
  // }
  
}
getNotes(project: Project | null): void {
  let notes: any[] = [];
  if (project) {
  this.noteService.getNotesInProject(project).subscribe({
  //  console.log('Cargando notas para el proyecto:', project);
    next: (data) => {
      notes = data;

      console.log('Notas cargadas:', notes);
    },
    error: (err) => {
      console.error('Error al cargar notas', err);
    }
  
  });}
} 
}
