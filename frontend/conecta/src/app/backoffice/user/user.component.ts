import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  name: string = 'Sara';
  email: string = 'sara@gmail.com';
  password: string = '********';

  async editarPerfil() {
    const { value: formValues } = await Swal.fire({
      title: 'Edit profile',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${this.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Email" type="email" value="${this.email}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Contraseña" type="password">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal2-container--dark'
      },
      preConfirm: () => {
        return {
          nombre: (document.getElementById('swal-input1') as HTMLInputElement).value,
          email: (document.getElementById('swal-input2') as HTMLInputElement).value,
          password: (document.getElementById('swal-input3') as HTMLInputElement).value
        };
      }
    });
    

    if (formValues) {
      // Actualizamos los datos en pantalla
      this.name = formValues.name;
      this.email = formValues.email;
      this.password = '*'.repeat(formValues.password.length || 8); // Opcional: ocultamos la contraseña
    }
  }
}
