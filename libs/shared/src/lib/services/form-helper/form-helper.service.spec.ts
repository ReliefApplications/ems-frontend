import { TestBed } from '@angular/core/testing';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { SurveyModel } from 'survey-core';
import { AuthService } from '../auth/auth.service';
import { ConfirmService } from '../confirm/confirm.service';
import { DocumentManagementService } from '../document-management/document-management.service';
import { DownloadService } from '../download/download.service';
import { FileService } from '../file/file.service';
import { TranslateService } from '@ngx-translate/core';
import { FormHelpersService } from './form-helper.service';

describe('FormHelpersService', () => {
  let service: FormHelpersService;

  const createSurveyMock = (question: unknown, data: Record<string, unknown>) =>
    ({
      data,
      getQuestionByValueName: () => question,
      getQuestionByName: () => question,
      getVariable: () => undefined,
    } as unknown as SurveyModel);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormHelpersService,
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: {} },
        { provide: SnackbarService, useValue: {} },
        { provide: ConfirmService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: DownloadService, useValue: {} },
        { provide: DocumentManagementService, useValue: {} },
        { provide: FileService, useValue: {} },
      ],
    });
    service = TestBed.inject(FormHelpersService);
  });

  it('keeps non-file question placeholders untouched', () => {
    const options = {
      name: 'birth_date',
      value: '1986-04-16T18:30:00.000Z',
      isExists: true,
    };
    const survey = createSurveyMock(
      { getType: () => 'text', inputType: 'date' },
      { birth_date: '1986-04-16T18:30:00.000Z' }
    );

    service.onProcessTextValue(survey, options);

    expect(options.value).toBe('1986-04-16T18:30:00.000Z');
    expect(options.isExists).toBe(true);
  });

  it('renders nothing for placeholders that point to no field or value', () => {
    const options = { name: 'missing', value: undefined, isExists: false };
    const survey = createSurveyMock(undefined, {});

    service.onProcessTextValue(survey, options);

    expect(options.value).toBe('');
    expect(options.isExists).toBe(true);
  });
});
