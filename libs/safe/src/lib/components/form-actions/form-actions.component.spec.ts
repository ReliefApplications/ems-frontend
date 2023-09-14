import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeFormActionsComponent } from './form-actions.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import * as Survey from 'survey-angular';

describe('SafeFormActionsComponent', () => {
  let component: SafeFormActionsComponent;
  let fixture: ComponentFixture<SafeFormActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFormActionsComponent],
      imports: [DropDownsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormActionsComponent);
    component = fixture.componentInstance;
    component.survey = new Survey.SurveyModel();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
