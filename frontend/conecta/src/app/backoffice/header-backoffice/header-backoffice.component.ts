import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {TokenService} from '../../services/auth/token.service';
import { SidebarStatusService } from '../../services/status/sidebar-status.service';
 import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-backoffice',
  standalone: true,
  imports: [],
  templateUrl: './header-backoffice.component.html',
  styleUrl: './header-backoffice.component.scss'
})
export class HeaderBackofficeComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  isActive: boolean = true;
  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private sidebarStatus: SidebarStatusService
  ) {}






  

  onLogoClick() {
    this.toggleSidebar.emit();
  }

  logout(route: string): void {
    Swal.fire({
      title: 'Signing out...',
      html: 'Please wait...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      timer: 1555,
      willClose: () => {
        this.tokenService.removeTokens();
        this.router.navigate([route]);
      },
      customClass: {
        container: 'swal2-container--dark'
      }
    });
  }
}
