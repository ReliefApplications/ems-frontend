import { TestBed } from '@angular/core/testing';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { SurveyModel } from 'survey-core';
import { DatePipe } from '../../pipes/date/date.pipe';
import { AuthService } from '../auth/auth.service';
import { ConfirmService } from '../confirm/confirm.service';
import { DateTranslateService } from '../date-translate/date-translate.service';
import { DocumentManagementService } from '../document-management/document-management.service';
import { DownloadService } from '../download/download.service';
import { FileService } from '../file/file.service';
import { TranslateService } from '@ngx-translate/core';
import { FormHelpersService } from './form-helper.service';

describe('FormHelpersService', () => {
  let service: FormHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormHelpersService,
        DatePipe,
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: {} },
        { provide: SnackbarService, useValue: {} },
        { provide: ConfirmService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: DownloadService, useValue: {} },
        { provide: DocumentManagementService, useValue: {} },
        { provide: FileService, useValue: {} },
        { provide: DateTranslateService, useValue: { currentLang: 'en' } },
      ],
    });
    service = TestBed.inject(FormHelpersService);
  });

  it('formats formatDate placeholders in HTML question dynamic text', () => {
    const options = {
      name: "formatDate(2024-11-26T23:00:00.000-05:00, 'dd/MM/yyyy HH:mm', 'UTC')",
      value: undefined,
      isExists: false,
    };

    service.onProcessTextValue({} as SurveyModel, options);

    expect(options.value).toBe('27/11/2024 04:00');
    expect(options.isExists).toBe(true);
  });

  it('keeps quoted date formats with commas intact', () => {
    const options = {
      name: "formatDate(2024-11-26T23:00:00.000-05:00, 'MMM d, y, h:mm a', '-0500')",
      value: undefined,
      isExists: false,
    };

    service.onProcessTextValue({} as SurveyModel, options);

    expect(options.value).toBe('Nov 26, 2024, 11:00 PM');
  });

  it('renders invalid formatDate values as empty text', () => {
    const options = {
      name: "formatDate(not a date, 'dd/MM/yyyy', 'UTC')",
      value: undefined,
      isExists: false,
    };

    service.onProcessTextValue({} as SurveyModel, options);

    expect(options.value).toBe('');
    expect(options.isExists).toBe(true);
  });
});
