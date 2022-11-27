import { UsuarioService, Empresa } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { NodeServerService } from 'src/app/services/node-server.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  form: FormGroup;
  file: File;
  paises: any[] = [];

  constructor(public _user: UsuarioService, private _server: NodeServerService) {
    this.file = new File([], '');
    this.form = new FormGroup({
      nombre: new FormControl(""),
      email: new FormControl("", Validators.email),
      direccion: new FormControl(""),
      paisid: new FormControl(""),
      telefono: new FormControl("")
    })
  }

  ngOnInit(): void {
    this._server.getAllPaises().subscribe(data => {
      this.paises = data.paises;
      this.form.patchValue(this._user.getEmpresa());
    })
  }

  subirImagen(): void {
    let input = document.getElementById('profileImg') as HTMLElement;
    input.click();
  }

  actualizarImagen(event: any): void {
    this.file = event.files[0];
    let empresa = this._user.getEmpresa();
    console.log(this.file)
    this._server.postActualizarImagenEmpresa(this.file, empresa?.id).subscribe((data) => {
      console.log(data);
      if (data.exito === 1) {
        let reader = new FileReader();
        reader.onload = (e) => {
          empresa.imagen = e.target?.result;
          empresa.imagen = empresa.imagen.slice(empresa.imagen.indexOf(',') + 1);
          this._user.actualizarEmpresa(empresa);
        };
        reader.readAsDataURL(this.file);
      }
    })
  }

  actualizarEmpresa() {
    if (this.form.valid) {
      const datos = this.form.value;
      let empresa = this._user.getEmpresa();
      let data = {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        direccion: datos.direccion,
        paisId: empresa.paisid
      }
      this._server.postUpdateDatosEmpresa(data, empresa.id).subscribe((data) => {
        if (data.exito) {
          Swal.fire(
            'Exito!',
            data.mensaje,
            'success',
          ).then((fulfilled) => {
            if (fulfilled.isConfirmed) {
              let newEmpresa = {
                id: empresa.id,
                nombre: datos.nombre,
                email: datos.email,
                telefono: datos.telefono,
                direccion: datos.direccion,
                paisid: datos.paisid,
                imagen: empresa.imagen,
                tipoimagen: empresa.tipoimagen
              } as Empresa;
              this._user.actualizarEmpresa(newEmpresa);
            }
          });
        } else {
          Swal.fire(
            'Error!',
            data.mensaje,
            'warning',
          );
        }
      })
    }
  }
}
