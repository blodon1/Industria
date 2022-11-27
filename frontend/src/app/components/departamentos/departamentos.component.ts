import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Operation } from '../ui/tabla/tabla.component';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ])]
})
export class DepartamentosComponent implements OnInit {

  departamento: any = null;
  operation: Operation = Operation.OPEN;
  actualizar: Subject<boolean> = new Subject();

  abierto: boolean = false;

  constructor(private _server: NodeServerService, private _router: Router, private _canvas: NgbOffcanvas, public _user: UsuarioService) {

  }

  ngOnInit(): void {
  }

  open(content: any): void {
    this._canvas.open(content, { position: 'end' }).dismissed.subscribe(result => {
      if (this.operation != Operation.OPEN) {
        this.actualizar.next(true)
      }
      this.operation = Operation.OPEN;
      this.departamento = null
    }, (err) => {
      console.error(err)
    });
  }

  new(content: any) {
    this.operation = Operation.NEW;
    this.open(content);
  }

  openId(content: any, id: any): void {
    this.departamento = id;
    this.operation = Operation.OPEN;
    this.abierto = true;
  }

  edit(content: any, id: any): void {
    this.departamento = id;
    this.operation = Operation.EDIT;
    this.open(content);
  }

  delete(id: any) {
    Swal.fire({ title: '¿Está seguro?', html: '¿Quiere eliminar el departamento?', showConfirmButton: true, showCancelButton: true },
    ).then((fulfilled) => {
      if (fulfilled.isConfirmed) {
        this._server.getDeleteDepto(id).subscribe(data => {
          if (data.exito) {
            Swal.fire(
              'Exito!',
              data.mensaje,
              'success',
            ).then((fulfilled) => {
              console.log(fulfilled)
              this.actualizar.next(true)
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

  closeOther(): void {
    this.abierto = false;
  }

  close(content: any): void {

  }

}

@Component({
  selector: 'app-departamento-nuevo',
  templateUrl: './departamento-nuevo.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentoNuevoComponent implements OnInit {
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
      descripcion: new FormControl(""),
    })
  }

  ngOnInit(): void {
    if (this.id != null) {
      this._server.getDepto(this.id).subscribe(data => {
        if (data.exito === 1) {
          let depto = data.depto;
          if (this.operation == Operation.OPEN) {
            this.form.patchValue(depto);
            this.form.disable();
          } else if (this.operation == Operation.EDIT) {
            this.form.patchValue(depto);
          }
        }
      });
    }
  }

  agregar(): void {

    this.enviado = true;
    if (this.form.valid) {
      let empresa = this._user.getEmpresa();
      let formData = this.form.value;
      this._server.postCreateDepto(formData, empresa.id).subscribe(data => {
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
      this._server.postUpdateDepto(formData, this.id).subscribe(data => {

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