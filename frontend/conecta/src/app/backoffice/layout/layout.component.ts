import { Component } from '@angular/core';
import { FolderPanelComponent } from '../folder-panel/folder-panel.component';
import { HeaderBackofficeComponent } from '../header-backoffice/header-backoffice.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderBackofficeComponent,
    SidebarComponent,
    RouterOutlet,
    FolderPanelComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  showFolderPanel = false;

  toggleFolderPanel() {
    this.showFolderPanel = !this.showFolderPanel;
  }
}
