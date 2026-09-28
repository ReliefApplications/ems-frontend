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
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
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

  it('renders file links, flagging outdated files and keeping their index', () => {
    const files = [
      { name: 'old.pdf', content: 'old-id', outdated: true },
      { name: 'current.docx', content: 'current-id' },
    ];
    const options = { name: 'documents', value: files, isExists: true };
    const survey = createSurveyMock(
      { getType: () => 'file' },
      {
        documents: files,
      }
    );

    service.onProcessTextValue(survey, options);

    const html = options.value as unknown as string;
    expect(html).toContain('index="0" data-outdated="true"');
    expect(html).toContain('index="1" style=');
    expect(html).not.toContain('index="1" data-outdated');
    expect(html.match(/>warning</g)).toHaveLength(1);
    expect(html).toContain('title="current.docx"');
  });

  it.each([
    ['hides', undefined, true],
    ['hides', false, true],
    ['displays', true, false],
  ])(
    '%s outdated files in HTML questions when showOutdatedFiles is %s',
    (_case, showOutdatedFiles, hidden) => {
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = '<div class="sd-html"></div>';
      const question = {
        getType: () => 'html',
        getPropertyValue: (name: string) =>
          name === 'showOutdatedFiles' ? showOutdatedFiles : undefined,
      } as any;

      service.onAfterRenderQuestion(createSurveyMock(question, {}), {
        question,
        htmlElement,
      });

      expect(
        htmlElement.classList.contains('html-question--hide-outdated-files')
      ).toBe(hidden);
    }
  );

  it('renders nothing for placeholders that point to no field or value', () => {
    const options = { name: 'missing', value: undefined, isExists: false };
    const survey = createSurveyMock(undefined, {});

    service.onProcessTextValue(survey, options);

    expect(options.value).toBe('');
    expect(options.isExists).toBe(true);
  });
});
