import { TestBed } from '@angular/core/testing';

import { SafeDownloadService } from './download.service';

describe('SafeDownloadService', () => {
  let service: SafeDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
