import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { NavComponent } from './components/nav/nav.component';

//CONEXION
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InventarioModule } from './inventario/inventario.module';
import { InventarioRoutingModule } from './inventario/app-routing.module';
import { UsuarioComponent } from './components/ui/usuario/usuario.component';
import { AdminRoutingModule } from './administracion/app-routing.module';
import { AdminModule } from './administracion/administracion.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { ProyectosRoutingModule } from './proyectos/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistroComponent,
    LoginComponent,
    VerificacionComponent,
    NavComponent,
    RecuperarComponent,
    ProfileComponent,
    UsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminRoutingModule,
    InventarioRoutingModule,
    //CONEXION
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule,
    InventarioModule,
    AdminModule,
    ProyectosModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
