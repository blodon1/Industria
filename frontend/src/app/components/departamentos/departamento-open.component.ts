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
    selector: 'app-departamento-open',
    templateUrl: './departamento-open.component.html',
    styleUrls: ['./departamentos.component.css']
})
export class DepartamentoOpenComponent implements OnInit {

    @Input('id') id: any = null;
    @Input() abierto: boolean = false;
    @Output() cerrado = new EventEmitter<boolean>();

    empleado: any = null;
    depto: any = null;
    operation: Operation = Operation.OPEN;
    actualizar: Subject<boolean> = new Subject();

    constructor(private _server: NodeServerService, private _router: Router, private _canvas: NgbOffcanvas, public _user: UsuarioService) {

    }

    ngOnInit(): void {
        this._server.getDepto(this.id).subscribe(data => {
            this.depto = data.depto;
        })
    }

    open(content: any): void {
        this._canvas.open(content, { position: 'end' }).dismissed.subscribe(result => {
            if (this.operation != Operation.OPEN) {
                this.actualizar.next(true)
            }
            this.operation = Operation.OPEN;
            this.empleado = null
        }, (err) => {
            console.error(err)
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
        Swal.fire({ title: '¿Está seguro?', html: '¿Quiere eliminar este empleado del departamento?', showConfirmButton: true, showCancelButton: true },
        ).then((fulfilled) => {
            if (fulfilled.isConfirmed) {
                this._server.postRemoveEmpleadoDepto({empleadoId: id}).subscribe(data => {
                    if (data.exito) {
                        Swal.fire(
                            'Exito!',
                            data.mensaje,
                            'success',
                        ).then((fulfilled) => {
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

    close(content: any): void {
        this._canvas.dismiss(content);
    }

    atras() {
        this.cerrado.emit();
    }
}

@Component({
    selector: 'app-departamento-open-nuevo',
    templateUrl: './departamento-open-nuevo.component.html',
    styleUrls: ['./departamentos.component.css']
})
export class DepartamentoOpenNuevoComponent implements OnInit {
    @Output() $creado = new EventEmitter<string>();

    form: FormGroup;

    @Input('id')
    id: any = null;

    @Input('depto')
    depto: any = null;

    @Input('operation')
    operation: Operation = Operation.NEW;

    empleados: any[] = [];
    creating: boolean = false;
    enviado: boolean = false;

    constructor(private _server: NodeServerService, private _user: UsuarioService) {
        this.form = new FormGroup({
            empladoid: new FormControl("", Validators.required)
        })
    }

    getEmpleados(): any[] {
        return this.empleados.filter(emp => {
            return emp.deptoempresaid == null;
        });
    }

    ngOnInit(): void {
        if (this.id != null) {
            this._server.getDatosEmpleado(
                this._user.getEmpresa().id).subscribe(data => {
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
        } else {
            this._server.getAllEmpleadosEmpresa(this._user.getEmpresa().id).subscribe(data => {
                this.empleados = data.empleados;
            });
        }
    }

    agregar(): void {
        this.enviado = true;
        if (this.form.valid) {
            let data = {
                deptoId: this.depto, empleadoId: this.form.value.empladoid
            }
            this._server.postAddEmpleadoDepto(data).subscribe(data => {
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