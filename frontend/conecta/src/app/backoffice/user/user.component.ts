import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { UserInterface } from '../../services/interfaces/user-interface';
import { ChangeDetectorRef } from '@angular/core';
import { CredentialsService } from '../../services/auth/credentials.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  
  user: UserInterface | null = null;


  constructor(
    private router: Router,
    private comunicationService: ComunicationService,
    private cdr: ChangeDetectorRef,
    private credentialsService: CredentialsService
  ) {}
  closeUser() {
  this.router.navigate(['/backoffice']); // o a donde quieras volver
}

ngOnInit() {
  this.comunicationService.userCom$.subscribe(user => {
    this.user = user;
    this.cdr.detectChanges();
  });
}
 async editarPerfil() {
  const formResult = await Swal.fire({
    title: 'Edit profile',
    html:
      `<input id="swal-input3" class="swal2-input" placeholder="Nombre de usuario" value="${this.user?.username}">` +
      `<input id="swal-input4" class="swal2-input" placeholder="Email" type="email" value="${this.user?.email}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Next',
    cancelButtonText: 'Cancel',
    customClass: { container: 'swal2-container--dark' },
    preConfirm: () => {
      const username = (document.getElementById('swal-input3') as HTMLInputElement).value;
      const email = (document.getElementById('swal-input4') as HTMLInputElement).value;
      if (!username || !email) {
        Swal.showValidationMessage('Please fill in both fields.');
        return;
      }
      return { username, email };
    }
  });

  if (!formResult.isConfirmed || !formResult.value || !this.user) return;

  const passwordResult = await Swal.fire({
    title: 'Do you want to change your password?',
    text: 'Click Yes to change it, or Cancel to skip.',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    customClass: { container: 'swal2-container--dark' }
  });

  let password = '';

  if (passwordResult.isConfirmed) {
    const result = await Swal.fire({
      title: 'New Password',
      input: 'password',
      inputPlaceholder: 'Enter new password',
      inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
      showCancelButton: true,
      confirmButtonText: 'Save',
      customClass: { container: 'swal2-container--dark' },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Password cannot be empty');
        }
        return value;
      }
    });

    if (result.isConfirmed && result.value) {
      password = result.value;
    }
  }

  const updatedUser: UserInterface = {
    ...this.user,
    username: formResult.value.username,
    email: formResult.value.email,
    ...(password ? { password } : {})  // only add password if changed
  };

  this.credentialsService.updateUser(updatedUser).subscribe({
    next: (res) => {
      this.user = res;
      this.comunicationService.sendUser(res);
      Swal.fire('Saved', 'Your profile has been successfully updated.', 'success');
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile.',
        customClass: { container: 'swal2-container--dark' }
      });
    }
  });
}


}