import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CredentialsService } from '../services/auth/credentials.service';
import { TokenService } from '../services/auth/token.service';
import { UserInterface } from '../services/interfaces/user-interface';
import {HttpClientModule} from '@angular/common/http';



@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  registerForm: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private CredentialsService: CredentialsService,
    private tokenService: TokenService,

  ){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  GoToSignIn(){
    this.router.navigate(['sign-in']);
  }
 onSubmit(){
    if(this.registerForm.valid){
      this.CredentialsService.register(this.registerForm.value as UserInterface).subscribe({
        next: (data:any)=>{
          console.log(data);
          this.CredentialsService.login(this.registerForm.value as UserInterface).subscribe({
            next: (data:any)=>{
              this.tokenService.saveTokens(data.access, data.refresh)
              this.router.navigate(['backoffice']);
            },
            error: (error:any)=>{
              console.log(error);
              alert('Error al iniciar sesion');
            }
          })
        },
        error: (error:any)=>{
          console.log(error);
          alert('Error al registrar');
        }
      })
    }else{
      console.log('Registro no valido');
      alert('Registro no valido');
    }
  }
  
}
