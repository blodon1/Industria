import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from '../components/ui/tabla/tabla.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconModule } from '@coreui/icons-angular';


@NgModule({
  declarations: [
    TablaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    IconModule,
  ],
  exports: [TablaComponent]
})
export class UIModule { }
