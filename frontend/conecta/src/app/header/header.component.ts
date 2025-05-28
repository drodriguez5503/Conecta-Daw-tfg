import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showMobileMenu = false;

  constructor(
    private router: Router,
  ){}

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    // Sincroniza el estado visual del checkbox hamburguesa
    const burger = document.getElementById('burger-menu-toggle') as HTMLInputElement;
    if (burger) burger.checked = this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
    // Asegura que la hamburguesa vuelva a su forma de tres líneas
    const burger = document.getElementById('burger-menu-toggle') as HTMLInputElement;
    if (burger) burger.checked = false;
  }

  goToSection(section: string) {
    this.closeMobileMenu();
    if (section === 'home') {
      window.location.hash = '';
    } else if (section === 'about') {
      window.location.hash = '#about';
    }
  }

  GoToSignIn(){
    this.router.navigate(['sign-in']);
    this.closeMobileMenu();
  }
}
