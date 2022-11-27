import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from '../components/categorias/categorias.component';
import { ProductosComponent, NuevoProductoComponent } from '../components/productos/productos.component';
import { UsuarioService } from '../services/usuario.service';

const routes: Routes = [
  { path: 'productos', component: ProductosComponent, canActivate: [UsuarioService] },
  { path: 'productos/nuevo', component: NuevoProductoComponent, canActivate: [UsuarioService] },
  { path: 'productos/:producto', component: NuevoProductoComponent, canActivate: [UsuarioService] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [UsuarioService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
