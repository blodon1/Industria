import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Operation } from '../ui/tabla/tabla.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categoria: any = null;
  operation: Operation = Operation.OPEN;

  constructor(private _server: NodeServerService, private _canvas: NgbOffcanvas, public _user: UsuarioService) { }

  ngOnInit(): void {
  }


  create(): void {
  }

  open(content: any): void {
    this._canvas.open(content, { position: 'end' }).dismissed.subscribe(closed => {
      if (this.operation != Operation.OPEN) { window.location.reload(); }
      this.operation = Operation.OPEN;
      this.categoria = null
    });
  }

  new(content: any) {
    this.operation = Operation.NEW;
    this.open(content);
  }

  openId(content: any, id: any): void {
    this.categoria = id;
    this.operation = Operation.OPEN;
    this.open(content);
  }

  edit(content: any, id: any): void {
    this.categoria = id;
    this.operation = Operation.EDIT;
    this.open(content);
  }

  delete(id: any) {
    Swal.fire({ title: '¿Está seguro?', html: '¿Quiere eliminar la categoría?', showConfirmButton: true, showCancelButton: true },
    ).then((fulfilled) => {
      if (fulfilled.isConfirmed) {
        this._server.getDeleteCategoria(id).subscribe(data => {
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
  selector: 'app-categoria-nuevo',
  templateUrl: './categoria-nuevo.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriaNuevoComponent implements OnInit {
  @Output() $creado = new EventEmitter<string>();

  form: FormGroup;

  @Input('id')
  id: any = null;

  @Input('operation')
  operation: Operation = Operation.NEW;

  creating: boolean = false;
  enviado: boolean = false;

  constructor(private _route: ActivatedRoute, private _server: NodeServerService, private _user: UsuarioService) {
    this.form = new FormGroup({
      nombre: new FormControl("", Validators.required),
      descripcion: new FormControl(""),
    })
  }

  ngOnInit(): void {
    if (this.id != null) {
      this._server.getCategoria(this.id).subscribe(data => {
        if (data.exito === 1) {
          let categoria = data.categoria;
          if (this.operation == Operation.OPEN) {
            this.form.patchValue(categoria);
            this.form.disable();
          } else if (this.operation == Operation.EDIT) {
            this.form.patchValue(categoria);
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
      this._server.postCreateCategoria(formData, empresa.id).subscribe(data => {
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
      this._server.postUpdateCategoria(formData, this.id).subscribe(data => {

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
