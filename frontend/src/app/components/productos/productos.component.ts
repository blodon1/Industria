import { Operation } from './../ui/tabla/tabla.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  producto: any = null;
  operation: Operation = Operation.OPEN;

  constructor(private _server: NodeServerService, private _router: Router, private _canvas: NgbOffcanvas, public _user: UsuarioService) {

  }

  ngOnInit(): void {

  }

  create(): void {
    this._router.navigate(['productos/nuevo']);
  }

  open(content: any): void {
    this._canvas.open(content, { position: 'end' }).dismissed.subscribe(closed => {
      if (this.operation != Operation.OPEN) { window.location.reload(); }
      this.operation = Operation.OPEN;
      this.producto = null
    });
  }

  new(content: any) {
    this.operation = Operation.NEW;
    this.open(content);
  }

  openId(content: any, id: any): void {
    this.producto = id;
    this.operation = Operation.OPEN;
    this.open(content);
  }

  edit(content: any, id: any): void {
    this.producto = id;
    this.operation = Operation.EDIT;
    this.open(content);
  }

  delete(id: any) {
    Swal.fire({ title: '¿Está seguro?', html: '¿Quiere eliminar el producto?', showConfirmButton: true, showCancelButton: true },
    ).then((fulfilled) => {
      if (fulfilled.isConfirmed) {
        this._server.getDeleteProducto(id).subscribe(data => {
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
  selector: 'app-producto-nuevo',
  templateUrl: './producto-nuevo.component.html',
  styleUrls: ['./productos.component.css']
})
export class NuevoProductoComponent implements OnInit {
  @Output() $creado = new EventEmitter<string>();

  @Input('id')
  id: any = null;

  @Input('operation')
  operation: Operation = Operation.NEW;

  categorias: any[] = [];
  productoForm: FormGroup;

  enviado: boolean = false;

  constructor(private _server: NodeServerService, private _user: UsuarioService) {
    this.productoForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      descripcion: new FormControl(""),
      categoriaid: new FormControl("", [Validators.required]),
      unidades: new FormControl(1, Validators.required),
      precio: new FormControl(1, Validators.required),
      finito: new FormControl(1, [Validators.required])
    })
  }

  ngOnInit(): void {
    this._server.getAllCategoria(this._user.getEmpresa().id).subscribe(data => {
      this.categorias = data.categorias;
    })

    if (this.id != null) {
      this._server.getProducto(this.id).subscribe(data => {
        if (data.exito === 1) {
          let producto = data.producto;
          console.log(data);
          if (typeof producto.precio === 'string') {
            producto.precio = producto.precio.replace(/[A-Za-z]+/g, '');
          }
          producto.finito = producto.finito ? 1 : 0;
          if (this.operation == Operation.OPEN) {
            this.productoForm.patchValue(producto);
            this.productoForm.disable();
          } else if (this.operation == Operation.EDIT) {
            this.productoForm.patchValue(producto);
          }
        }
      });
    }
  }

  agregar(): void {

    this.enviado = true;
    if (this.productoForm.valid) {
      let empresa = this._user.getEmpresa();
      let formData = this.productoForm.value;
      this._server.postCreateProducto(formData, empresa.id).subscribe(data => {
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
    if (this.productoForm.valid) {
      let formData = this.productoForm.value;
      this._server.postUpdateProducto(formData, this.id).subscribe(data => {

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