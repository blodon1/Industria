'use strict'

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NodeServerService } from 'src/app/services/node-server.service';
import { passwordComparator, passwordValidator, phoneValidator } from './passw.helper';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	form: FormGroup;
	paises: any[] = [];

	constructor(private _nodeServer: NodeServerService, private _router: Router) {
		this.form = new FormGroup({
			nombre: new FormControl("", Validators.required),
			apellido: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			passw: new FormControl("", [Validators.required, passwordValidator]),
			pais: new FormControl("", Validators.required),
			telefono: new FormControl("", [Validators.required, phoneValidator]),
			direccion: new FormControl(""),
			passw2: new FormControl("", [Validators.required]),
			termino: new FormControl(false, Validators.requiredTrue)
		}, passwordComparator)

	}

	ngOnInit() {
		this._nodeServer.getAllPaises().subscribe(data => {
			this.paises = data.paises;
		}, err => console.log(err));

	}

	public post(): void {
		if (this.form.valid) {
			let data = this.form.value;
			let user = {
				nombre: data.nombre + ' ' + data.apellido,
				email: data.email,
				telefono: data.telefono.replace('-', ''),
				direccion: data.direccion,
				contrasenia: data.passw,
				paisId: data.pais
			}

			this._nodeServer.postNuevoUsuario(user).subscribe(data => {
				Swal.fire({
					title: data.exito == 1 ? 'Exito' : 'Error',
					text: data.mensaje,
					timer: 5000
				}).then((fulfilled: SweetAlertResult<any>) => {
					if ((fulfilled.isConfirmed || fulfilled.isDismissed) && data.exito == 1) {
						this._router.navigate(['login']);
					}
				})
			}, err => console.error(err));
		}
	}
}
