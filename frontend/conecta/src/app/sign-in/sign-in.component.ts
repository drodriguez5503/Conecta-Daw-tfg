import { Component } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
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
      next: (data:any)=>{
        console.log(data);
        this.router.navigate(['']);
      }
    }else{
      console.log('Formulario no valido');
      alert('Formulario no valido');
    }
  }
}
