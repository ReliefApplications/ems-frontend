import { TestBed } from '@angular/core/testing';
import { ReferenceDataService } from './reference-data.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ReferenceDataService', () => {
  let service: ReferenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(ReferenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
