import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() {
  }

  showMessage(
    title: string,
    msg: string,
    icon: "success" | "warning" | "info" | "error" | "question" = "info"): void {
    Swal.fire({
      title: title,
      text: msg,
      icon: icon,
      confirmButtonText: "Cerrar notificación"
    })
  }

  loader(title: string = "Cargando...", message: string = ''): void {
    Swal.fire({
      title: title,
      text: message,
      allowEscapeKey: false,
      didOpen() {
        Swal.showLoading()
      }
    })
  }

  async showOptionDialog(title: string, options: string[]): Promise<string | null> {
    const inputOptions: Record<string, string> = {};
    options.forEach((opt, index) => {
      inputOptions[index.toString()] = opt;
    });

    const {value} = await Swal.fire({
      title,
      input: 'radio',
      inputOptions,
      inputValidator: (value) => {
        if (!value) return 'Debes seleccionar una opción';
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    });

    return value !== undefined ? options[parseInt(value)] : null;
  }


  async showConfirmation(
    title:string,
    message:string,
    confirmButtonText:string="Aceptar",
    cancelButtonText:string="Cancelar",
  ): Promise<boolean> {

    const result = await Swal.fire({
      title: title,
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    })

    return result.isConfirmed;

  }

  close() {
    Swal.close();
  }
}
