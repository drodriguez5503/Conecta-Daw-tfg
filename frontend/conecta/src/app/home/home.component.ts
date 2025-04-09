import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  

  constructor(
    private router: Router
  ) { }

  GoSignin() {
    this.router.navigate(['sign-in']);
  }
  GoSignup() {
    this.router.navigate(['sign-up']);
  }
}
