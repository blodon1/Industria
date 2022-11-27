import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../components/administracion/admin.component';
import { UsuarioService } from '../services/usuario.service';

const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [UsuarioService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
