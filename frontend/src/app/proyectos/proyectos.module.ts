import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectosComponent } from '../components/proyectos/proyectos.component';
import { UIModule } from '../ui/ui.module';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { ProyectoNuevoComponent } from '../components/proyecto-nuevo/proyecto-nuevo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipoNuevoComponent } from '../components/equipo-nuevo/equipo-nuevo.component';
import { canActivateLicencia } from '../services/canActivateLicencia.service';


@NgModule({
  declarations: [
    ProyectosComponent,
    ProyectoNuevoComponent,
    EquipoNuevoComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    IconModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [IconSetService, canActivateLicencia]
})
export class ProyectosModule { }
