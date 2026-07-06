import { SurveyModel } from 'survey-core';
import { DatePipe } from '../../pipes/date/date.pipe';
import { DateTranslateService } from '../date-translate/date-translate.service';
import { FormHelpersService } from './form-helper.service';

describe('FormHelpersService', () => {
  let service: FormHelpersService;

  beforeEach(() => {
    const dateTranslateService = {
      currentLang: 'en',
    } as unknown as DateTranslateService;

    service = new FormHelpersService(
      {},
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      new DatePipe(dateTranslateService)
    );
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
