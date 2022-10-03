import { TestBed } from '@angular/core/testing';
import { environment } from 'projects/back-office/src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { SafeApiProxyService } from './api-proxy.service';

describe('SafeApiProxyService', () => {
  let service: SafeApiProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: environment }],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SafeApiProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
