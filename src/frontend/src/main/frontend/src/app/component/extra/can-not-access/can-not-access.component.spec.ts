import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanNotAccessComponent } from './can-not-access.component';

describe('CanNotAccessComponent', () => {
  let component: CanNotAccessComponent;
  let fixture: ComponentFixture<CanNotAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanNotAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanNotAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
