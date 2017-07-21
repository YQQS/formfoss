import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPreviewComponent } from './submit-preview.component';

describe('SubmitPreviewComponent', () => {
  let component: SubmitPreviewComponent;
  let fixture: ComponentFixture<SubmitPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
