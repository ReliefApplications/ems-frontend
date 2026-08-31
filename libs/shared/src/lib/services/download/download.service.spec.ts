import { DOCUMENT } from '@angular/common';
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
import { SnackbarService } from '@oort-front/ui';
import { throwError } from 'rxjs';
import { RestService } from '../rest/rest.service';

type SnackbarSpinner = {
  error: boolean;
  loading: boolean;
  message: string;
};

type SnackbarRef = {
  instance: {
    nestedComponent: { instance: SnackbarSpinner };
    triggerSnackBar: jest.Mock;
  };
};

describe('DownloadService', () => {
  let service: DownloadService;
  let restService: { post: jest.Mock };
  let snackBarRef: SnackbarRef;

  beforeEach(() => {
    const spinner: SnackbarSpinner = {
      error: false,
      loading: true,
      message: '',
    };
    snackBarRef = {
      instance: {
        nestedComponent: { instance: spinner },
        triggerSnackBar: jest.fn(),
      },
    };
    restService = { post: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        TranslateService,
        { provide: RestService, useValue: restService },
        {
          provide: SnackbarService,
          useValue: {
            openComponentSnackBar: jest.fn(() => snackBarRef),
          },
        },
        { provide: DOCUMENT, useValue: document },
      ],
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

  it('shows the server validation error for a rejected upload', (done) => {
    restService.post.mockReturnValue(
      throwError(() => new Error('Invalid resource reference.'))
    );

    service
      .uploadFile(
        'upload/resource/records/resource-id',
        new File(['content'], 'records.xlsx')
      )
      .subscribe({
        error: () => {
          expect(snackBarRef.instance.nestedComponent.instance.message).toBe(
            'Invalid resource reference.'
          );
          expect(snackBarRef.instance.nestedComponent.instance.error).toBe(
            true
          );
          expect(snackBarRef.instance.nestedComponent.instance.loading).toBe(
            false
          );
          expect(snackBarRef.instance.triggerSnackBar).toHaveBeenCalled();
          done();
        },
      });
  });
});
