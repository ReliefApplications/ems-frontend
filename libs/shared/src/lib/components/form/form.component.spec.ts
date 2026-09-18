import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { FormComponent } from './form.component';
import { HttpClientModule } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { Apollo } from 'apollo-angular';
import { SurveyModel } from 'survey-core';
import { AuthService } from '../../services/auth/auth.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  const createSurvey = jest.fn<
    SurveyModel,
    Parameters<FormBuilderService['createSurvey']>
  >(() => new SurveyModel());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        { provide: DialogRef, useValue: {} },
        { provide: Apollo, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: SnackbarService, useValue: {} },
        { provide: UILayoutService, useValue: {} },
        {
          provide: FormBuilderService,
          useValue: {
            createSurvey,
            addEventsCallBacksToSurvey: jest.fn(),
          },
        },
        { provide: FormHelpersService, useValue: {} },
        {
          provide: AutoTranslateService,
          useValue: {
            suppressAutoTranslationWhile: (
              _survey: SurveyModel,
              callback: () => void
            ) => callback(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
      ],
      declarations: [FormComponent],
      imports: [
        DialogCdkModule,
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    createSurvey.mockClear();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.form = {
      structure: '{}',
    };
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('provides an existing unique record to the survey', () => {
    const uniqueRecord = { id: 'unique-record-id', data: {} };
    component.form = {
      structure: '{}',
      uniqueRecord,
    };

    fixture.detectChanges();

    expect(createSurvey.mock.lastCall?.[2]).toBe(uniqueRecord);
  });
});
