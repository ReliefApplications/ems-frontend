import { TestBed } from '@angular/core/testing';

import { SafeBreadcrumbService } from './breadcrumb.service';

describe('SafeBreadcrumbService', () => {
  let service: SafeBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
