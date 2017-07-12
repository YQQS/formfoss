import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewComponent } from './form-new.component';

describe('FormNewComponent', () => {
  let component: FormNewComponent;
  let fixture: ComponentFixture<FormNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
