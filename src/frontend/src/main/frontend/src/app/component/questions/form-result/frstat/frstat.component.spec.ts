import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FRStatComponent } from './frstat.component';

describe('FRStatComponent', () => {
  let component: FRStatComponent;
  let fixture: ComponentFixture<FRStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FRStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FRStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
