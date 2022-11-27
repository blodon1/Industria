'use strict'

import { Component, OnInit } from '@angular/core';
//formulario reactivo, lo cambian si ven necesario
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
//service
import { NodeServerService } from 'src/app/services/node-server.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	mensaje = {}
	form: FormGroup;

	constructor(private _server: NodeServerService, private _router: Router, private _user: UsuarioService) {
		this.form = new FormGroup({
			email: new FormControl("", Validators.email),
			passw: new FormControl("")
		})
	}

	ngOnInit(): void {

	}

	logIn() {

		if (!this.form.valid) {
			Swal.fire(
				'Error!',
				'Ingrese un email valido',
				'warning',
			);
		} else if (this.form.valid) {
			let usuario = this.form.value;
			let datos = {
				email: usuario.email,
				contrasenia: usuario.passw
			};
			this._server.postInicioSesion(datos).subscribe(data => {

				if (data.exito) {
					let usuario = data.usuario;
					this._user.actualizarUsuario(data.usuario);

					this._server.getDatosEmpresa(usuario.id).subscribe(data => {
						this._user.actualizarEmpresa(data.empresa);
						console.log(usuario);
						this._server.getCheckUserLicencia(usuario.id).subscribe(data => {
							this._user.actualizarLicencia(data.licencia);
							this._router.navigate(['admin']);
						})
					})
				} else {
					//console.log(data.acceso);
					Swal.fire(
						'Error!',
						data.mensaje,
						'warning',
					);
				}

			}, err => console.log(err));
		} else {
			Swal.fire(
				'Error!',
				'Por favor completar todos los datos',
				'warning',
			);
		}
	}

	comprobarUsuario() {
		if (localStorage.getItem('usuario')) {
			//console.log("Ya se ha iniciado sesión");
			Swal.fire(
				'',
				'Ya se tiene una sesión activa',
				'warning',
			);
			this._router.navigate(['inicio']);
		}
	}

}
