import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { NodeServerService } from 'src/app/services/node-server.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyecto-nuevo',
  templateUrl: './proyecto-nuevo.component.html',
  styleUrls: ['./proyecto-nuevo.component.css']
})
export class ProyectoNuevoComponent implements OnInit {

  actualizar: Subject<boolean> = new Subject();
  @Output() $saved = new EventEmitter<string>();

  form: FormGroup;
  equipos: any[] = [];
  equipo: any = null;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private _server: NodeServerService, private _user: UsuarioService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

    this.form = new FormGroup({
      nombre: new FormControl("", Validators.required),
      descripcion: new FormControl(""),
      teamWorkId: new FormControl("", Validators.required),
      fin: new FormControl("", Validators.required),
      inicio: new FormControl("", [Validators.required])
    })
  }

  ngOnInit(): void {
    this._server.getALLTeamWork(this._user.getEmpresa().id).subscribe(data => {
      console.log(data)
      this.equipos = data.teamWorks;
    })
  }

  getEquipo() {
    return this.equipo
  }

  actualizarEquipo(value: any) {
    this.equipo = value;
    this.actualizar.next(true);
  }

  new() {
    console.log(this.form)
    if (this.form.valid) {
      this._server.postCreateProyecto(this.form.value, this._user.getEmpresa().id).subscribe(data => {
        if (data.exito) {
          Swal.fire(
            'Exito!',
            data.mensaje,
            'success',
          ).then((fulfilled) => {
            if (fulfilled.isConfirmed) {
              this.$saved.emit();
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

  onDateSelection(date: NgbDate) {
    let stringDate = `${date.year}-${date.month}-${date.day}`;
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.form.get('inicio')?.setValue(stringDate);
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.form.get('fin')?.setValue(stringDate);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.form.get('inicio')?.setValue(stringDate);
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
