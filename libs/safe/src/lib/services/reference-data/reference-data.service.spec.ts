import { TestBed } from '@angular/core/testing';
import { SafeReferenceDataService } from './reference-data.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SafeReferenceDataService', () => {
  let service: SafeReferenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeReferenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
