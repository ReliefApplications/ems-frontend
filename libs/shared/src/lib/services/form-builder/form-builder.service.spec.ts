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
});
