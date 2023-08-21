import { TestBed } from '@angular/core/testing';
import { SafeGridLayoutService } from './grid-layout.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SafeGridLayoutService', () => {
  let service: SafeGridLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeGridLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
