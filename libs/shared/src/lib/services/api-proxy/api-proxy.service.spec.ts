import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiProxyService } from './api-proxy.service';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('ApiProxyService', () => {
  let service: ApiProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [HttpClientModule, ApolloTestingModule],
    });
    service = TestBed.inject(ApiProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
