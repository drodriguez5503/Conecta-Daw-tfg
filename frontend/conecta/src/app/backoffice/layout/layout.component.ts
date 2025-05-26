import { Component, OnInit, OnDestroy } from '@angular/core';
import { FolderPanelComponent } from '../folder-panel/folder-panel.component';
import { HeaderBackofficeComponent } from '../header-backoffice/header-backoffice.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';
import { SidebarStatusService } from '../../services/status/sidebar-status.service';

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
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent  {
  isCollapsed = false;
  showSettingsPanel = false;

  constructor(
    private sidebarStatus: SidebarStatusService,
  ) { }
  handleSidebarToggle() {
  this.isCollapsed = !this.isCollapsed;
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
}

