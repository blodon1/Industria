import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentoRoutingModule } from './app-routing.module';
import { DepartamentosComponent, DepartamentoNuevoComponent } from '../components/departamentos/departamentos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from '../ui/ui.module';
import { DepartamentoOpenComponent, DepartamentoOpenNuevoComponent } from '../components/departamentos/departamento-open.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
  declarations: [
    DepartamentosComponent,
    DepartamentoNuevoComponent,
    DepartamentoOpenComponent,
    DepartamentoOpenNuevoComponent,
  ],
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    BrowserAnimationsModule
  ],
  exports: [DepartamentosComponent]
})
export class DepartamentosModule { }
