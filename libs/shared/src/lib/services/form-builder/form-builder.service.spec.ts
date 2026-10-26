import { TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { AutoTranslateService } from '../auto-translate/auto-translate.service';
import { DocumentManagementService } from '../document-management/document-management.service';
import { FormHelpersService } from '../form-helper/form-helper.service';
import { RestService } from '../rest/rest.service';
import { FormBuilderService } from './form-builder.service';
import { SurveyModel } from 'survey-core';

describe('FormBuilderService', () => {
  let service: FormBuilderService;
  let openSnackBar: jest.Mock;

  beforeEach(() => {
    openSnackBar = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        FormBuilderService,
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: {} },
        { provide: SnackbarService, useValue: { openSnackBar } },
        { provide: RestService, useValue: {} },
        { provide: FormHelpersService, useValue: {} },
        { provide: DocumentManagementService, useValue: {} },
        { provide: AutoTranslateService, useValue: {} },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
    });
    service = TestBed.inject(FormBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('file upload limit', () => {
    const question = (value: unknown[] | undefined, allowedFileNumber = 5) =>
      ({
        value,
        getPropertyValue: (name: string) =>
          name === 'allowMultiple' ? true : allowedFileNumber,
      } as any);
    const file = { name: 'a.pdf' } as any;

    it('counts the files already attached, stored and outdated ones included', () => {
      const attached = [
        { name: 'stored.pdf', content: { itemId: '1' }, outdated: true },
        { name: 'b.pdf', content: 'data:' },
        { name: 'c.pdf', content: 'data:' },
        { name: 'd.pdf', content: 'data:' },
      ];

      expect(
        (service as any).checkFileUploadValidity(question(attached), [file])
      ).toBe(true);
      expect(openSnackBar).not.toHaveBeenCalled();

      expect(
        (service as any).checkFileUploadValidity(
          question([...attached, { name: 'e.pdf' }]),
          [file]
        )
      ).toBe(false);
      expect(openSnackBar).toHaveBeenCalledTimes(1);
    });

    it('accepts uploads on an empty question within the limit', () => {
      expect(
        (service as any).checkFileUploadValidity(question(undefined), [
          file,
          file,
        ])
      ).toBe(true);
      expect(openSnackBar).not.toHaveBeenCalled();
    });
  });

  describe('picked files', () => {
    const objectUrl = 'blob:http://localhost/picked';
    let createObjectURL: jest.Mock;
    let revokeObjectURL: jest.Mock;

    const createSurvey = () =>
      new SurveyModel({
        elements: [
          // storeDataAsText is forced off by the creator settings in the app
          {
            type: 'file',
            name: 'documents',
            allowMultiple: true,
            storeDataAsText: false,
          },
          {
            type: 'file',
            name: 'copies',
            allowMultiple: true,
            storeDataAsText: false,
          },
        ],
      });

    beforeEach(() => {
      createObjectURL = jest.fn(() => objectUrl);
      revokeObjectURL = jest.fn();
      (URL as any).createObjectURL = createObjectURL;
      (URL as any).revokeObjectURL = revokeObjectURL;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('holds picked files as object URLs, without reading them', () => {
      const survey = createSurvey();
      const question = survey.getQuestionByName('documents');
      const storage: Record<string, File[]> = {};
      service.addEventsCallBacksToSurvey(
        survey,
        { next: jest.fn() } as any,
        storage
      );
      const raw = new File(['x'.repeat(1024)], 'big.pdf', {
        type: 'application/pdf',
      });
      const readAsDataURL = jest.spyOn(FileReader.prototype, 'readAsDataURL');

      question.loadFiles([raw]);

      expect(readAsDataURL).not.toHaveBeenCalled();
      expect(createObjectURL).toHaveBeenCalledWith(raw);
      expect(question.value).toEqual([
        { name: 'big.pdf', type: 'application/pdf', content: objectUrl },
      ]);
      expect(storage['documents']).toEqual([raw]);
    });

    it('releases the object URL of a removed file, unless another question holds a copy', () => {
      const survey = createSurvey();
      const documents = survey.getQuestionByName('documents');
      const copies = survey.getQuestionByName('copies');
      const storage: Record<string, File[]> = {};
      service.addEventsCallBacksToSurvey(
        survey,
        { next: jest.fn() } as any,
        storage
      );
      const picked = {
        name: 'a.pdf',
        type: 'application/pdf',
        content: objectUrl,
      };
      const other = { name: 'b.pdf', content: 'blob:http://localhost/other' };
      const stored = { name: 'c.pdf', content: 'form-id/blob' };
      survey.data = { documents: [picked, other, stored], copies: [picked] };
      storage['documents'] = [new File([''], 'a.pdf'), new File([''], 'b.pdf')];

      documents.removeFile(other.name);
      expect(revokeObjectURL).toHaveBeenCalledWith(other.content);
      expect(storage['documents'].map((f) => f.name)).toEqual(['a.pdf']);

      documents.removeFile(stored.name);
      documents.removeFile(picked.name);
      // Still referenced by the copy
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(documents.value).toEqual([]);

      copies.removeFile(picked.name);
      expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);
    });
  });
});
