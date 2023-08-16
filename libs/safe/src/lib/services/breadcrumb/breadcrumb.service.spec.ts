import { TestBed } from '@angular/core/testing';
import { SafeBreadcrumbService } from './breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SafeBreadcrumbService', () => {
  let service: SafeBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    });
    service = TestBed.inject(SafeBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
