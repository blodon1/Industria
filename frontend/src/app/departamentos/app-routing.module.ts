import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoOpenComponent } from '../components/departamentos/departamento-open.component';
import { DepartamentosComponent } from '../components/departamentos/departamentos.component';
import { UsuarioService } from '../services/usuario.service';

const routes: Routes = [
  { path: 'departamentos', component: DepartamentosComponent, canActivate: [UsuarioService] },
  { path: 'departamentos/:1', component: DepartamentoOpenComponent, canActivate: [UsuarioService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UsuarioService]
})
export class DepartamentoRoutingModule { }

