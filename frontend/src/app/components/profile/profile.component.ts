import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router'; import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { passwordComparator, passwordValidator } from '../registro/passw.helper';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    passForm: FormGroup;
    strikeCheckout: any = null;
    file: File;
    pais: string = "";
    imagen: any;

    constructor(private _server: NodeServerService, private _router: Router, public _user: UsuarioService) {
        this.passForm = new FormGroup({
            pass0: new FormControl("", [Validators.required, passwordValidator]),
            passw: new FormControl("", [Validators.required, passwordValidator]),
            passw2: new FormControl("", [Validators.required]),
        }, passwordComparator);

        this.file = new File([], '');
    }

    ngOnInit(): void {
        this.stripePaymentGateway();
        let user = this._user.getUsuario();
        console.log(user)

        this._server.getAllPaises().subscribe(data => {
            this.pais = data.paises.find((pais: any) => pais.id === user?.paisid).nombre;
        })
    }

    subirImagen(): void {
        let input = document.getElementById('profileImg') as HTMLElement;
        input.click();
    }

    pagar() {
        let that = this;
        const strikeCheckout = (<any>window).StripeCheckout.configure({
            key: 'pk_test_51LXHMeFsEYLGCkERL3pCiMvY17lgLa06Z0Z2Mw30qAdrwxXgVSNSgebLSahjt2Y74wfJLlHfhEU5wQCM3Y0dTezS00ZfqmzJ2n',
            locale: 'auto',
            token: function (stripeToken: any) {
                if (stripeToken) {
                    that._server.postGetToken({ usuarioId: that._user.getUsuario().id }).subscribe(data => {
                        let token = data.token;

                        that._server.getPagoLicencia(token).subscribe(data => {
                            if (data.exito == 1) {
                                that._server.getCheckUserLicencia(that._user.getUsuario().id).subscribe(data => {
                                    that._user.actualizarLicencia(data.licencia);
                                    window.location.reload();
                                })
                            }
                        })
                    })
                }
            }
        });

        strikeCheckout.open({
            name: 'LAVADI',
            description: 'Licencia completa',
            amount: 10 * 100
        });
    }

    stripePaymentGateway() {
        if (!window.document.getElementById('stripe-script')) {
            const scr = window.document.createElement("script");
            scr.id = "stripe-script";
            scr.type = "text/javascript";
            scr.src = "https://checkout.stripe.com/checkout.js";

            scr.onload = () => {
                this.strikeCheckout = (<any>window).StripeCheckout.configure({
                    key: 'pk_test_51LXHMeFsEYLGCkERL3pCiMvY17lgLa06Z0Z2Mw30qAdrwxXgVSNSgebLSahjt2Y74wfJLlHfhEU5wQCM3Y0dTezS00ZfqmzJ2n',
                    locale: 'auto',
                    token: function (token: any) {
                        console.log(token)
                        alert('Payment via stripe successfull!');
                    }
                });
            }

            window.document.body.appendChild(scr);
        }
    }

    actualizarImagen(event: any): void {
        this.file = event.files[0];
        let user = this._user.getUsuario();
        this._server.postActualizarImagenPerfil(this.file, user?.id).subscribe((data) => {
            if (data.exito === 1) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    user.imagen = e.target?.result;
                    user.imagen = user.imagen.slice(user.imagen.indexOf(',') + 1);
                    this._user.actualizarUsuario(user);
                };
                reader.readAsDataURL(this.file);
            }
        })
    }

    actualizarPassword(): void {
        if (this.passForm.valid) {
            let user = this._user.getUsuario();

            let formData = this.passForm.value;
            let datos = {
                email: user?.email,
                contrasenia: formData.pass0
            };

            this._server.postInicioSesion(datos).subscribe(data => {

                if (data.exito) {
                    let body = {
                        usuarioId: user?.id,
                        nuevaContrasenia: formData.passw
                    }

                    this._server.postGuardarNuevaContrasenia(body).subscribe(data => {
                        if (data.exito) {
                            Swal.fire(
                                'Exito!',
                                data.mensaje,
                                'success',
                            );
                            this.passForm.reset();
                        } else {
                            Swal.fire(
                                'Error!',
                                data.mensaje,
                                'warning',
                            );
                        }
                    })
                } else {
                    this.passForm.get('pass0')?.setErrors(['login']);
                }
            }, err => console.log(err));
        }
    }
}

