import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {TokenService} from '../../services/auth/token.service';

@Component({
  selector: 'app-header-backoffice',
  standalone: true,
  imports: [],
  templateUrl: './header-backoffice.component.html',
  styleUrl: './header-backoffice.component.scss'
})
export class HeaderBackofficeComponent {
  constructor(private router: Router, private tokenService: TokenService) {}

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
