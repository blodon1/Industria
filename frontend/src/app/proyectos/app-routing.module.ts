import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyectosComponent } from '../components/proyectos/proyectos.component';
import { canActivateLicencia } from '../services/canActivateLicencia.service';

const routes: Routes = [
  { path: 'proyectos', component: ProyectosComponent, canActivate: [canActivateLicencia]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }
