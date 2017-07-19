import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FRQuestionComponent } from './frquestion.component';

describe('FRQuestionComponent', () => {
  let component: FRQuestionComponent;
  let fixture: ComponentFixture<FRQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FRQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FRQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
