import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQueriesComponent } from './survey-queries.component';

describe('SurveyQueriesComponent', () => {
  let component: SurveyQueriesComponent;
  let fixture: ComponentFixture<SurveyQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyQueriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
