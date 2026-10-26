import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DownloadService } from './download.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('DownloadService', () => {
  let service: DownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, TranslateService],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        DialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(DownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showUploadReport', () => {
    it('opens a modal listing the rows violating uniqueness rules', async () => {
      const dialog = TestBed.inject(Dialog);
      const open = jest.spyOn(dialog, 'open').mockReturnValue({} as any);
      await (service as any).showUploadReport(
        [{ row: 3, errors: [{ question: 'org_code', errors: ['Duplicate'] }] }],
        'errors'
      );
      expect(open).toHaveBeenCalledTimes(1);
      const { data } = open.mock.calls[0][1] as any;
      expect(data.errors).toHaveLength(1);
      expect(data.hideConfirm).toBe(true);
    });

    it('does not open any modal when there is no row to report', async () => {
      const dialog = TestBed.inject(Dialog);
      const open = jest.spyOn(dialog, 'open').mockReturnValue({} as any);
      await (service as any).showUploadReport(undefined, 'warnings');
      await (service as any).showUploadReport([], 'errors');
      expect(open).not.toHaveBeenCalled();
    });
  });

  describe('getUploadErrorMessage', () => {
    it('returns the backend-provided message when present', () => {
      const message = (service as any).getUploadErrorMessage(
        new Error('Row 2: the value "bad" in the _id column is not valid.')
      );
      expect(message).toEqual(
        'Row 2: the value "bad" in the _id column is not valid.'
      );
    });

    it('falls back to the generic translated message when there is no error message', () => {
      const message = (service as any).getUploadErrorMessage({});
      expect(message).toEqual('common.notifications.file.upload.error');
    });

    it('falls back to the generic translated message for an empty message', () => {
      const message = (service as any).getUploadErrorMessage(new Error(''));
      expect(message).toEqual('common.notifications.file.upload.error');
    });

    it('falls back to the generic translated message for a coerced object (network-level failure)', () => {
      const message = (service as any).getUploadErrorMessage(
        new Error(String(new ProgressEvent('error')))
      );
      expect(message).toEqual('common.notifications.file.upload.error');
    });
  });
});
