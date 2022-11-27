import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponent } from '../components/empresa/empresa.component';
import { EmpleadosComponent, EmpleadoNuevoComponent} from '../components/empleados/empleados.component';
import { AdminComponent } from '../components/administracion/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { DepartamentoNuevoComponent, DepartamentosComponent } from '../components/departamentos/departamentos.component';
import { UIModule } from '../ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartamentosModule } from '../departamentos/departamentos.module';


@NgModule({
  declarations: [
    AdminComponent,
    EmpresaComponent,
    EmpleadosComponent,
    EmpleadoNuevoComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    DepartamentosModule
  ],
  providers: [IconSetService]
})
export class AdminModule { }
