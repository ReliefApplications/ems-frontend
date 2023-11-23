import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSurveyQueryModalComponent } from './edit-survey-query-modal.component';

describe('EditSurveyQueryModalComponent', () => {
  let component: EditSurveyQueryModalComponent;
  let fixture: ComponentFixture<EditSurveyQueryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSurveyQueryModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSurveyQueryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
