import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatComponent } from './user-stat.component';

describe('UserStatComponent', () => {
  let component: UserStatComponent;
  let fixture: ComponentFixture<UserStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
