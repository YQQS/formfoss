import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FRUserComponent } from './fruser.component';

describe('FRUserComponent', () => {
  let component: FRUserComponent;
  let fixture: ComponentFixture<FRUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FRUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FRUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
