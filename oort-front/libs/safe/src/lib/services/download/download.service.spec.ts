import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from 'projects/back-office/src/environments/environment';

import { SafeDownloadService } from './download.service';

describe('SafeDownloadService', () => {
  let service: SafeDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: environment }],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SafeDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
