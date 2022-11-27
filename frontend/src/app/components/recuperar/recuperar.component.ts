import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { passwordComparator, passwordValidator } from '../registro/passw.helper';
import { NodeServerService } from '../../services/node-server.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  emailForm: FormGroup;
  recoverForm: FormGroup;

  token: string | null = "";

  constructor(private _server: NodeServerService, private _route: ActivatedRoute, private _router: Router) {
    this.emailForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    });

    this.recoverForm = new FormGroup({
      passw: new FormControl("", [Validators.required, passwordValidator]),
      passw2: new FormControl("", [Validators.required])
    }, passwordComparator);
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.token = params.get('token');
    })
  }

  recover(): void {

    if (this.emailForm.valid) {
      this._server.postSolicitudNuevaContrasenia({ email: this.emailForm.value.data }).subscribe(data => {
        Swal.fire({
          title: data.exito == 1 ? 'Exito' : 'Error',
          text: data.exito == 1 ? 'Se ha enviado el correo' : 'No se ha podido enviar su solicitud',
        }).then((fulfilled: SweetAlertResult<any>) => {
          if (data.exito == 1) {
            this._router.navigate(['login']);
          } else {
            this._router.navigate(['']);
          }
        })
      })
    }
  }

  newPassword(): void {
    this._server.getNuevaContraseniaForm(this.token).subscribe(data => {
      Swal.fire({
        title: data.exito == 1 ? 'Exito' : 'Error',
        text: data.exito == 1 ? 'Se ha enviado el correo' : 'No se ha podido enviar su solicitud',
      }).then((fulfilled: SweetAlertResult<any>) => {
        if (data.exito == 1) {
          this._router.navigate(['login']);
        } else {
          this._router.navigate(['']);
        }
      })
    })
  }

}
