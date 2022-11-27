import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent, NuevoProductoComponent } from '../components/productos/productos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaNuevoComponent, CategoriasComponent } from '../components/categorias/categorias.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { UIModule } from '../ui/ui.module';

@NgModule({
  declarations: [
    ProductosComponent,
    NuevoProductoComponent,
    CategoriasComponent,
    CategoriaNuevoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    IconModule,
    UIModule
  ],
  providers: [IconSetService]
})
export class InventarioModule { }
