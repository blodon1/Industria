import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-equipo-nuevo',
  templateUrl: './equipo-nuevo.component.html',
  styleUrls: ['./equipo-nuevo.component.css']
})
export class EquipoNuevoComponent implements OnInit {
  @Output() $saved = new EventEmitter<string>();

  form: FormGroup;
  equipos: any[] = [];
  seleccionados: any[] = [];

  constructor(
    public formatter: NgbDateParserFormatter,
    private _server: NodeServerService,
    public _user: UsuarioService,
  ) {

    this.form = new FormGroup({
      nombre: new FormControl("", Validators.required),
    })
  }

  ngOnInit(): void {

  }

  getSeleccionados(equipos: any) {
    this.seleccionados = equipos;
  }

  new() {
    if (this.form.valid) {
      this._server.postCreateTeamWork(this.form.value, this._user.getEmpresa().id).subscribe(data => {
        console.log(data)
        if (data.exito == 1) {
          let id = data.teamwork;
          
          for (let seleccionado in this.seleccionados) {
            console.log(this.seleccionados);
            this._server.postAddEmpleadoTW({ empleadoId: this.seleccionados[seleccionado] }, id).subscribe(data => {
              console.log(data);
              if (data.exito == 1) this.$saved.emit();
            })
          }
        }
      })
    }
  }
}
