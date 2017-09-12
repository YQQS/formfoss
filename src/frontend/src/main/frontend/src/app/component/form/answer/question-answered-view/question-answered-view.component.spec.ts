import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnsweredViewComponent } from './question-answered-view.component';

describe('QuestionAnsweredViewComponent', () => {
  let component: QuestionAnsweredViewComponent;
  let fixture: ComponentFixture<QuestionAnsweredViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnsweredViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnsweredViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
