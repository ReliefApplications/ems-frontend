import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
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
