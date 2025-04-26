import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    this.router.navigate([route]); // Navega a la ruta especificada
  }
  

}
