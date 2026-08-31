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
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { EDIT_RECORD } from './graphql/mutations';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { SurveyModel } from 'survey-core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let formHelpersService: FormHelpersService;
  let mutate: jest.Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        { provide: DialogRef, useValue: {} },
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
        { provide: Apollo, useValue: { mutate: jest.fn() } },
        { provide: AuthService, useValue: {} },
        { provide: FormBuilderService, useValue: {} },
        {
          provide: FormHelpersService,
          useValue: {
            uploadFiles: jest.fn(),
            setEmptyQuestions: jest.fn(),
            createTemporaryRecords: jest.fn(),
          },
        },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
        { provide: UILayoutService, useValue: {} },
        { provide: AutoTranslateService, useValue: {} },
        { provide: ConfirmService, useValue: {} },
      ],
      declarations: [FormComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
    }).compileComponents();

    formHelpersService = TestBed.inject(FormHelpersService);
    mutate = TestBed.inject(Apollo).mutate as jest.Mock;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.form = {
      id: 'form-id',
      structure: '{}',
    };
    component.survey = new SurveyModel({ elements: [] });
    component.survey.showCompletedPage = false;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the completed page after publishing a restored draft', async () => {
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
});
