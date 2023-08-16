import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SafeApiProxyService } from './api-proxy.service';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('SafeApiProxyService', () => {
  let service: SafeApiProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [HttpClientModule, ApolloTestingModule],
    });
    service = TestBed.inject(SafeApiProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
