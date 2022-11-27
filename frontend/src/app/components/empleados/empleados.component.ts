import { Operation } from './../ui/tabla/tabla.component';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { identidadValidator } from '../registro/identidad.helper';
import { phoneValidator } from '../registro/passw.helper';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  empleado: any = null;
  operation: Operation = Operation.OPEN;
  actualizar: Subject<boolean> = new Subject();

  constructor(private _server: NodeServerService, private _router: Router, private _canvas: NgbOffcanvas, public _user: UsuarioService) {

  }
  ngOnInit(): void {
  }

  open(content: any): void {
    this._canvas.open(content, { position: 'end' }).dismissed.subscribe((result) => {
      if (this.operation != Operation.OPEN) { window.location.reload(); }
      this.operation = Operation.OPEN;
      this.empleado = null
    });
  }

  new(content: any) {
    this.operation = Operation.NEW;
    this.open(content);
  }

  openId(content: any, id: any): void {
    this.empleado = id;
    this.operation = Operation.OPEN;
    this.open(content);
  }

  edit(content: any, id: any): void {
    this.empleado = id;
    this.operation = Operation.EDIT;
    this.open(content);
  }

  delete(id: any) {
    Swal.fire({ title: '¿Está seguro?', html: '¿Quiere eliminar el empleado?', showConfirmButton: true, showCancelButton: true },
    ).then((fulfilled) => {
      if (fulfilled.isConfirmed) {
        this._server.getDeleteEmpleado(id).subscribe(data => {
          if (data.exito) {
            Swal.fire(
              'Exito!',
              data.mensaje,
              'success',
            ).then((fulfilled) => {
              window.location.reload();
            });
          } else {
            Swal.fire(
              'Error!',
              data.mensaje,
              'warning',
            );
          }
        });
      }
    });
  }

  close(content: any): void {
    this._canvas.dismiss(content);
  }

}

@Component({
  selector: 'app-empleado-nuevo',
  templateUrl: './empleado-nuevo.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadoNuevoComponent implements OnInit {
  @Output() $creado = new EventEmitter<string>();

  form: FormGroup;

  @Input('id')
  id: any = null;

  @Input('operation')
  operation: Operation = Operation.NEW;

  creating: boolean = false;
  enviado: boolean = false;

  constructor(private _server: NodeServerService, private _user: UsuarioService) {
    this.form = new FormGroup({
      nombre: new FormControl("", Validators.required),
      identidad: new FormControl("", [Validators.required, identidadValidator]),
      telefono: new FormControl("", [Validators.required, phoneValidator]),
      email: new FormControl("", [Validators.required, Validators.email]),
      direccion: new FormControl(""),
      salarioBase: new FormControl("", [Validators.required, Validators.min(0)])
    })
  }

  ngOnInit(): void {
    if (this.id != null) {
      this._server.getDatosEmpleado(this.id).subscribe(data => {
        if (data.exito === 1) {
          let empleado = data.empleado;
          if (this.operation == Operation.OPEN) {
            this.form.patchValue(empleado);
            this.form.disable();
          } else if (this.operation == Operation.EDIT) {
            this.form.patchValue(empleado);
          }
        }
      });
    }
  }

  agregar(): void {
    console.log(this.form)
    this.enviado = true;
    if (this.form.valid) {
      let empresa = this._user.getEmpresa();
      let formData = this.form.value;
      this._server.postCreateEmpleado(formData, empresa.id).subscribe(data => {
        if (data.exito) {
          Swal.fire(
            'Exito!',
            data.mensaje,
            'success',
          ).then((fulfilled) => {
            if (fulfilled.isConfirmed) {
              this.$creado.emit();
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

  editar(): void {
    if (this.form.valid) {
      let formData = this.form.value;
      this._server.postUpdateDatosEmpleado(formData, this.id).subscribe(data => {

        if (data.exito === 1) {
          Swal.fire(
            'Exito!',
            data.mensaje,
            'success',
          ).then((fulfilled) => {
            if (fulfilled.isConfirmed) {
              this.$creado.emit();
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

  check() {
    return this.operation != Operation.OPEN;
  }

  isEdit() {
    return this.operation == Operation.EDIT;
  }
}