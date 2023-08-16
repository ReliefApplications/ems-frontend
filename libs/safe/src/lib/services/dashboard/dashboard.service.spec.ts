import { TestBed } from '@angular/core/testing';
import { SafeDashboardService } from './dashboard.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SafeDashboardService', () => {
  let service: SafeDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
