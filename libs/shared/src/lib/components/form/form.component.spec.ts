import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { EDIT_RECORD } from './graphql/mutations';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { SurveyModel } from 'survey-core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let formHelpersService: FormHelpersService;
  let mutate: jest.Mock;
  const createSurvey = jest.fn<
    SurveyModel,
    Parameters<FormBuilderService['createSurvey']>
  >(() => new SurveyModel());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        { provide: DialogRef, useValue: {} },
        { provide: Apollo, useValue: { mutate: jest.fn() } },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
        { provide: UILayoutService, useValue: {} },
        {
          provide: FormBuilderService,
          useValue: {
            createSurvey,
            addEventsCallBacksToSurvey: jest.fn(),
          },
        },
        {
          provide: FormHelpersService,
          useValue: {
            uploadFiles: jest.fn(),
            setEmptyQuestions: jest.fn(),
            createTemporaryRecords: jest.fn(),
          },
        },
        {
          provide: AutoTranslateService,
          useValue: {
            suppressAutoTranslationWhile: (
              _survey: SurveyModel,
              callback: () => void
            ) => callback(),
          },
        },
        { provide: ConfirmService, useValue: {} },
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

    formHelpersService = TestBed.inject(FormHelpersService);
    mutate = TestBed.inject(Apollo).mutate as jest.Mock;
  });

  beforeEach(() => {
    createSurvey.mockClear();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.form = {
      id: 'form-id',
      structure: '{}',
    };
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show the completed page after publishing a restored draft', async () => {
    component.survey = new SurveyModel({ elements: [] });
    component.survey.showCompletedPage = false;
    jest.spyOn(formHelpersService, 'uploadFiles').mockResolvedValue();
    jest
      .spyOn(formHelpersService, 'createTemporaryRecords')
      .mockResolvedValue();
    mutate.mockReturnValue(
      of({
        data: {
          editRecord: {
            id: 'draft-id',
            incrementalId: '1',
            draft: false,
            data: {},
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            createdBy: { name: 'Test User' },
            validationErrors: [],
          },
        },
      })
    );
    component.onLoadDraftRecord('draft-id');

    await component.onComplete();

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        mutation: EDIT_RECORD,
        variables: expect.objectContaining({
          id: 'draft-id',
          updateDraftStatus: false,
        }),
      })
    );

    expect(component.lastDraftRecord).toBeUndefined();
    expect(component.survey.showCompletedPage).toBe(true);
    expect(component.surveyActive).toBe(false);
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
