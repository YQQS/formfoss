import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEditComponent } from './dynamic-edit.component';

describe('DynamicEditComponent', () => {
  let component: DynamicEditComponent;
  let fixture: ComponentFixture<DynamicEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
