import { Component, OnInit, OnDestroy } from '@angular/core';
import { FolderPanelComponent } from '../folder-panel/folder-panel.component';
import { HeaderBackofficeComponent } from '../header-backoffice/header-backoffice.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf, NgClass, AsyncPipe } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';
import { SidebarStatusService } from '../../services/status/sidebar-status.service';
import { ProjectOptionsSidebarComponent } from '../project-options-sidebar/project-options-sidebar.component';
import { ComunicationService } from '../../services/comunication/comunication.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderBackofficeComponent,
    SidebarComponent,
    RouterOutlet,
    FolderPanelComponent,
    SettingsComponent,
    NgIf,
    NgClass,
    ProjectOptionsSidebarComponent,
    AsyncPipe,
    
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent  {
  isCollapsed = false;
  showSettingsPanel = false;

  constructor(
    private sidebarStatus: SidebarStatusService,
    private router: Router,
    public comunicationService: ComunicationService
  ) { }
  handleSidebarToggle() {
  this.isCollapsed = !this.isCollapsed;
}
shouldShowProjectOptionsSidebar(): boolean {
  const validRoutes = [
    '/backoffice/note',
    '/backoffice/conections',
    // puedes agregar más aquí si quieres que se muestre también en otras
  ];
  return validRoutes.some(route => this.router.url.startsWith(route));
}

  

}









  // ngOnInit(): void {
  //   document.body.classList.add('backoffice-layout'); // Agrega la clase al body
  // }

  // ngOnDestroy(): void {
  //   document.body.classList.remove('backoffice-layout'); // Elimina la clase al salir del backoffice
  // }

  // toggleFolderPanel() {
  //   this.showFolderPanel = !this.showFolderPanel;
  //   if (this.showFolderPanel) {
  //     this.showSettingsPanel = false;
  //   }
  // } 

  // toggleSettingsPanel() {
  //   this.showSettingsPanel = !this.showSettingsPanel;
  //   if (this.showSettingsPanel) {
  //     this.showFolderPanel = false;
  //   }
  // }


