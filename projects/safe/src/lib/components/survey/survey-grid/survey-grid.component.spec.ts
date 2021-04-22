import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSurveyGridComponent } from './survey-grid.component';

describe('SafeSurveyGridComponent', () => {
  let component: SafeSurveyGridComponent;
  let fixture: ComponentFixture<SafeSurveyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeSurveyGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSurveyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
