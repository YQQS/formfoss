import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStructureEditComponent } from './form-structure-edit.component';

describe('FormStructureEditComponent', () => {
  let component: FormStructureEditComponent;
  let fixture: ComponentFixture<FormStructureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStructureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStructureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
