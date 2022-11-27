import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'
import { AdminComponent } from './components/administracion/admin.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsuarioService } from './services/usuario.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'verificarUsuario/:token', component: VerificacionComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: ProfileComponent,  canActivate: [UsuarioService]  },
  { path: 'recuperar/:token', component: RecuperarComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: '***', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
