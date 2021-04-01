import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoSurveyGridComponent } from './survey-grid.component';

describe('WhoSurveyGridComponent', () => {
  let component: WhoSurveyGridComponent;
  let fixture: ComponentFixture<WhoSurveyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoSurveyGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoSurveyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
