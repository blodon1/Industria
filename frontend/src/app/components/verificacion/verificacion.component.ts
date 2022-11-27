import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeServerService } from 'src/app/services/node-server.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {
  constructor(private _server: NodeServerService, private _route: ActivatedRoute, private _router: Router) { }

  mensaje: string = "";
  exito: boolean = false;

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      let token = params.get('token');

      this._server.getVerificarUsuario(token).subscribe(data => {
        Swal.fire({
          title: data.exito == 1 ? 'Exito' : 'Error', 
          text: data.exito == 1 ? 'Su usuario ha sido verificado y activado' : 'El token ha expirado o es inválido',
        }).then((fulfilled: SweetAlertResult<any>) => {
          if (fulfilled.isConfirmed || fulfilled.isDismissed) {
            this._router.navigate(['login']);
          } else {
            this._router.navigate(['']);
          }
        })
      })
    });
  }
}
