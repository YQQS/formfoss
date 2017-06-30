import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseresComponent } from './useres.component';

describe('UseresComponent', () => {
  let component: UseresComponent;
  let fixture: ComponentFixture<UseresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
