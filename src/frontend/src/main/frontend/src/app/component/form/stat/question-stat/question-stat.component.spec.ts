import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStatComponent } from './question-stat.component';

describe('QuestionStatComponent', () => {
  let component: QuestionStatComponent;
  let fixture: ComponentFixture<QuestionStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
