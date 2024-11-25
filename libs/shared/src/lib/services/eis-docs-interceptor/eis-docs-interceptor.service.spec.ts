import { TestBed } from '@angular/core/testing';
import { EISDocsInterceptorService } from './eis-docs-interceptor.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('EISDocsInterceptorService', () => {
  let service: EISDocsInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: { csApiUrl: 'csApiUrl' } },
      ],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(EISDocsInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
