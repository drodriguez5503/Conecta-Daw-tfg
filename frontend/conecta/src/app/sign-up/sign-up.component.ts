import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  loginForm: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder
  ){
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  GoToSignIn(){
    this.router.navigate(['sign-in']);
  }

  onSubmit(){
    if(this.loginForm.valid){
        this.router.navigate(['/sign-in']);
    }else{
      console.log('Registro no valido');
      alert('Registro no valido');
    }
  }
}
