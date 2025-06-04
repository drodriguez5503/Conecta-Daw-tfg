import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ComunicationService } from '../../services/comunication/comunication.service';
import { UserInterface } from '../../services/interfaces/user-interface';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  user: UserInterface | null = null;


  constructor(
    private router: Router,
    private comunicationService: ComunicationService,
    private cdr: ChangeDetectorRef
  ) {}
  closeUser() {
  this.router.navigate(['/backoffice']); // o a donde quieras volver
}

ngOnInit() {
  this.comunicationService.userCom$.subscribe(user => {
    if (user) {
      this.user = user;
      console.log('Usuario recibido en UserComponent:', this.user);
      this.cdr.detectChanges();
    }
  });
}
  async editarPerfil() {
    const { value: formValues } = await Swal.fire({
      title: 'Edit profile',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${this.user?.fullName}">` +
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${this.user?.username}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Email" type="email" value="${this.user?.email}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Contraseña" type="password" value="${this.user?.password || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'swal2-container--dark'
      },
      preConfirm: () => {
        return {
          name: (document.getElementById('swal-input1') as HTMLInputElement).value,
          username: (document.getElementById('swal-input1') as HTMLInputElement).value,
          email: (document.getElementById('swal-input2') as HTMLInputElement).value,
          password: (document.getElementById('swal-input3') as HTMLInputElement).value
        };
      }
    });
    

    if (formValues) {
      // Actualizamos los datos en pantalla
      this.name = formValues.name;
      this.email = formValues.email;
      this.username = formValues.username;
      this.password = formValues.password;
      // this.password = '*'.repeat(formValues.password.length || 8); // Opcional: ocultamos la contraseña

      this.user = {
        ...this.user,
        fullName: formValues.name,
        username: formValues.username,
        email: formValues.email,
        password: formValues.password
      };
      this.comunicationService.sendUser(this.user);
    }
  }
}
