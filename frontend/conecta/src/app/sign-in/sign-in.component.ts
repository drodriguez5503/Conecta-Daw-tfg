import { Component } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CredentialsService } from '../services/auth/credentials.service';
import { LoginInterface } from '../services/interfaces/user-interface';
import { TokenService } from '../services/auth/token.service';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private CredentialsService: CredentialsService,
    private tokenService: TokenService
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  GoToSignUp(){
    this.router.navigate(['sign-up']);
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.CredentialsService.login(this.loginForm.value as LoginInterface).subscribe({
        next: (data:any)=>{
          console.log(data);
          this.tokenService.saveTokens(data.token, "234")
          this.router.navigate(['']);
        },
        error: (error:any)=>{
          console.log(error);
          alert('Error al iniciar sesion');
        }
      });
    }else{
      console.log('Formulario no valido');
      alert('Formulario no valido');
    }
  }
}
