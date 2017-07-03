import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrototypeComponent } from './form-prototype.component';

describe('FormPrototypeComponent', () => {
  let component: FormPrototypeComponent;
  let fixture: ComponentFixture<FormPrototypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPrototypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
