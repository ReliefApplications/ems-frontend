import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SafeDownloadService } from './download.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeDownloadService', () => {
  let service: SafeDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
      ],
    });
    service = TestBed.inject(SafeDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
