import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SafeDownloadService } from './download.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('SafeDownloadService', () => {
  let service: SafeDownloadService;

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
    service = TestBed.inject(SafeDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
