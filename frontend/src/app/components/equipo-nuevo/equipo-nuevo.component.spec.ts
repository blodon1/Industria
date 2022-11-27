import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoNuevoComponent } from './equipo-nuevo.component';

describe('EquipoNuevoComponent', () => {
  let component: EquipoNuevoComponent;
  let fixture: ComponentFixture<EquipoNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipoNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
