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
    const { value: formValues, isDismissed } = await Swal.fire({
      title: 'Edit profile',
      html:
        `<input id="swal-input3" class="swal2-input" placeholder="Nombre de usuario" value="${this.user?.username}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Email" type="email" value="${this.user?.email}">` +
        `<button id="swal-change-password" type="button" 
        style="
        margin-top:12px;width:60.5%;padding:10px 0;border-radius:15px;background:#232323;color:#ff8200;font-weight:bold;border:2px solid #ff8200;font-family:'IBM Plex Mono',monospace;font-size:1rem;">Change password</button>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal2-container--dark'
      },
      didOpen: () => {
        const btn = document.getElementById('swal-change-password');
        if (btn) {
          btn.addEventListener('click', () => {
            Swal.fire({
              title: 'Change password',
              input: 'password',
              inputPlaceholder: 'New password',
              showCancelButton: true,
              confirmButtonText: 'Save',
              cancelButtonText: 'Cancel',
              customClass: { container: 'swal2-container--dark' }
            }).then(result => {
              if (result.isConfirmed && result.value) {
                (document.getElementById('swal-change-password') as HTMLButtonElement).setAttribute('data-password', result.value);
                (document.getElementById('swal-change-password') as HTMLButtonElement).textContent = 'Password changed';
              }
            });
          });
        }
      },
      preConfirm: () => {
        const passwordBtn = document.getElementById('swal-change-password') as HTMLButtonElement;
        return {
          username: (document.getElementById('swal-input3') as HTMLInputElement).value,
          email: (document.getElementById('swal-input4') as HTMLInputElement).value,
          password: passwordBtn?.getAttribute('data-password') || ''
        };
      }
    });
    if (isDismissed) {
      return; // Si se cancela, no hacer nada más
    }
    if (formValues && this.user) {
      const updatedUser: UserInterface = {
      ...this.user,
      email: formValues.email,
      username: formValues.username,
      password: formValues.password,
      };

      this.credentialsService.updateUser(updatedUser).subscribe({
        next: (res) => {
          this.user = res;
          this.comunicationService.sendUser(res);
          Swal.fire('Save', 'Your profile has been successfully updated.');
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error updating profile',
            customClass: { container: 'swal2-container--dark' }
          });
        }
      });
    } else if (!formValues) {
      // Mostrar popup para cambiar contraseña si los campos están vacíos
      const result = await Swal.fire({
        title: 'Change password',
        html:
          `<input id="swal-new-password" class="swal2-input" type="password" placeholder="Nueva contraseña">` +
          `<input id="swal-confirm-password" class="swal2-input" type="password" placeholder="Confirm new password">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        customClass: { container: 'swal2-container--dark' },
        preConfirm: () => {
          const newPass = (document.getElementById('swal-new-password') as HTMLInputElement).value;
          const confirmPass = (document.getElementById('swal-confirm-password') as HTMLInputElement).value;
          if (!newPass || !confirmPass) {
            Swal.showValidationMessage('Please fill in both fields.');
            return false;
          }
          if (newPass !== confirmPass) {
            Swal.showValidationMessage('The passwords do not match.');
            return false;
          }
          return newPass;
        }
      });
      if (result.isConfirmed && result.value && this.user) {
        const updatedUser: UserInterface = {
          ...this.user,
          password: result.value
        };
        this.credentialsService.updateUser(updatedUser).subscribe({
          next: (res) => {
            this.user = res;
            this.comunicationService.sendUser(res);
            Swal.fire({
              icon: 'success',
              title: 'Updated password',
              text: 'Your password has been successfully updated.',
              customClass: { container: 'swal2-container--dark' }
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error updating password',
              customClass: { container: 'swal2-container--dark' }
            });
          }
        });
      }
    }
  }
}
