import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNuevoComponent } from './task-nuevo.component';

describe('TaskNuevoComponent', () => {
  let component: TaskNuevoComponent;
  let fixture: ComponentFixture<TaskNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
