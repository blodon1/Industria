import { IconSetService } from '@coreui/icons-angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { NodeServerService } from 'src/app/services/node-server.service';
import { cilZoom, cilPencil, cilDelete, freeSet } from '@coreui/icons';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  seleccionados: number[] = [];

  @Output() $ver = new EventEmitter<string>();
  @Output() $modificar = new EventEmitter<string>();
  @Output() $eliminar = new EventEmitter<string>();
  @Output() $getSeleccionados = new EventEmitter<any[]>();

  @Input()
  columnas: string[] = [];

  @Input()
  puedeEditar: boolean = true;

  @Input()
  puedeVer: boolean = true;

  @Input()
  puedeBorrar: boolean = true;

  @Input()
  conBusqueda: boolean = true;

  @Input()
  conPaginacion: boolean = true;

  @Input()
  conSelector: boolean = true;

  @Input()
  puedeSeleccionar: boolean = false;

  @Input()
  campos: string[] = [];

  @Input()
  datos: any[] = [];

  @Input()
  llamada: string = "";

  @Input()
  numItems: number = 10;

  @Input()
  actualizar: Subject<boolean> = new Subject<boolean>();

  cantColeccion: number = 0;
  pagina: number = 1;
  numPaginas: number = 1;

  filter = new FormControl('', { nonNullable: true });

  constructor(private _nodeServer: NodeServerService, public _icons: IconSetService) {
    _icons.icons = freeSet;
  }

  ngOnInit(): void {
    this.obtenerInformacion();
    this.actualizar.subscribe(actualizar => {
      if (actualizar) {
        this.obtenerInformacion();
      }
    })
  }

  seleccionado(id: number) {
    return this.seleccionados.indexOf(id) != -1;
  }

  seleccionar(id: number) {
    if (!this.seleccionado(id)) {
      this.seleccionados.push(id);
      this.$getSeleccionados.emit(this.seleccionados);
    }
  }

  deseleccionar(id: number) {
    if (this.seleccionado(id)) {
      this.seleccionados = this.seleccionados.filter(function (item) {
        return item !== id
      })
      this.$getSeleccionados.emit(this.seleccionados);
    }
  }

  obtenerInformacion(): void {
    if (this.llamada != "") {
      let params: string[] = this.llamada.split(":");
      if (params.length > 0) {
        let paramLlamada = params[0].split('|');
        (this._nodeServer[paramLlamada[0] as keyof NodeServerService] as (param?: any) => Observable<any>)(paramLlamada[1]).subscribe(data => {
          this.datos = data[params[1]];
          if (this.datos != undefined && this.datos.length > 0) {
            this.cantColeccion = this.datos.length;
            this.numPaginas = this.datos.length / this.numItems;
          }
        });
      }
    }
  }

  limpiar(input: any): string {
    let salida: string = "";
    if (typeof input === "boolean") { salida = input ? 'Verdadero' : 'Falso' }
    else if (typeof input === "number") { salida = input.toString() }
    else { salida = input }
    return salida;
  }

  paginar(): Array<any> {
    let datos = this.datos
    if (this.conBusqueda) {
      datos = datos
        .filter(data => {
          const filtro = this.filter.value.toLowerCase();
          let flag: boolean = false;
          let campos = ['id', ...this.campos];
          for (let i = 0; i < this.campos.length; i++) {
            if (data[campos[i]] != undefined && data[campos[i]].toString().toLowerCase().includes(filtro))
              flag = true;
          }
          return flag;
        });
    }

    //this.cantColeccion = datos.length;

    if (this.conPaginacion) {
      datos = datos.slice((this.pagina - 1) * this.numItems, (this.pagina - 1) * this.numItems + this.numItems)
    }

    return datos;
  }

  ver(id: any) {
    this.$ver.emit(id);
  }

  modificar(id: any) {
    this.$modificar.emit(id);
  }

  eliminar(id: any): void {
    this.$eliminar.emit(id);
  }
}

export enum Operation {
  OPEN,
  NEW,
  EDIT
}