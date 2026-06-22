import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SurveyModel } from 'survey-core';

import { FormActionsComponent } from './form-actions.component';

describe('FormActionsComponent', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;
  let onLangChange: Subject<{ lang: string }>;

  beforeEach(async () => {
    onLangChange = new Subject<{ lang: string }>();
    await TestBed.configureTestingModule({
      declarations: [FormActionsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            currentLang: 'en',
            defaultLang: 'en',
            onLangChange,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('updates the survey locale when the application language changes', () => {
    component.survey = new SurveyModel({
      elements: [
        {
          type: 'dropdown',
          name: 'status',
          choices: [
            {
              value: 'open',
              text: { default: 'Open', fr: 'Ouvert' },
            },
          ],
        },
      ],
    });
    const renderedQuestion = component.survey.getQuestionByName(
      'status'
    ) as unknown as { _propertyValueChangedVirtual: jest.Mock };
    renderedQuestion._propertyValueChangedVirtual = jest.fn();
    fixture.detectChanges();

    onLangChange.next({ lang: 'fr' });

    expect(component.survey.locale).toBe('fr');
    expect(
      renderedQuestion._propertyValueChangedVirtual
    ).not.toHaveBeenCalled();
  });

  it('supports Ukrainian when syncing the survey locale', () => {
    component.survey = new SurveyModel({
      elements: [
        {
          type: 'dropdown',
          name: 'status',
          choices: [
            {
              value: 'open',
              text: { default: 'Open', uk: 'Відкрито' },
            },
          ],
        },
      ],
    });
    fixture.detectChanges();

    onLangChange.next({ lang: 'uk' });

    expect(component.survey.locale).toBe('uk');
  });
});
