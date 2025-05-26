import { Component, Input, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarStatusService } from '../../services/status/sidebar-status.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UseStateService } from '../../services/auth/use-state.service';
import { CredentialsService } from '../../services/auth/credentials.service';

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
  user: any;

constructor(
  private credentialsService: CredentialsService,
){}
 ngOnInit(): void {
      this.credentialsService.getUserInfo().subscribe({
      next: (data) => {
        this.user = data;
        console.log('Usuario cargado:', data);
      },
      error: (err) => {
        console.error('Error al obtener el usuario', err);
      }
    });
 }

toggleProjectForm() {
  this.showProjectForm = !this.showProjectForm;
  if (!this.showProjectForm) this.projectName = '';
}

  createProject() {
    if (this.projectName.trim()) {
      console.log('Proyecto creado:', this.projectName);
      // Aquí va la lógica real para crear el proyecto
      this.toggleProjectForm();
    }
  }

  
  

  
}