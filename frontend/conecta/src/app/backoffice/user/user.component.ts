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
    const { value: formValues } = await Swal.fire({
      title: 'Edit profile',
      html:
        // `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${this.user?.first_name}">` +
        // `<input id="swal-input2" class="swal2-input" placeholder="Nombre" value="${this.user?.last_name}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Nombre de usuario" value="${this.user?.username}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Email" type="email" value="${this.user?.email}">` +
        `<input id="swal-input5" class="swal2-input" placeholder="Nueva contraseña" >`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal2-container--dark'
      },
      preConfirm: () => {
        return {
          // first_name: (document.getElementById('swal-input1') as HTMLInputElement).value,
          // last_name: (document.getElementById('swal-input2') as HTMLInputElement).value,
          username: (document.getElementById('swal-input3') as HTMLInputElement).value,
          email: (document.getElementById('swal-input4') as HTMLInputElement).value,
          password: (document.getElementById('swal-input5') as HTMLInputElement).value
        };
      }
    });
    

    if (formValues && this.user) {
      const updatedUser: UserInterface = {
      ...this.user,
      email: formValues.email,
      username: formValues.username,
      password: formValues.password,
      // this.password = '*'.repeat(formValues.password.length || 8); // Opcional: ocultamos la contraseña
      };

      this.credentialsService.updateUser(updatedUser).subscribe({
        next: (res) => {
          console.log('Respuesta del backend al guardar:', res);
          this.user = res;
          this.comunicationService.sendUser(res);
          Swal.fire('Guardado', 'Tu perfil ha sido actualizado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar el perfil', err);
          Swal.fire('Error', 'Error al actualizar el perfil', 'error');
        }
      });
    }
  }
}
