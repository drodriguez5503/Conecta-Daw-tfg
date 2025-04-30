import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-backoffice',
  standalone: true,
  imports: [],
  templateUrl: './header-backoffice.component.html',
  styleUrl: './header-backoffice.component.scss'
})
export class HeaderBackofficeComponent {
  constructor(private router: Router) {}

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
        console.log('Cerrando sesión...');
        this.router.navigate([route]);
      },
      customClass: {
        container: 'swal2-container--dark'
      }
    });
  }
}