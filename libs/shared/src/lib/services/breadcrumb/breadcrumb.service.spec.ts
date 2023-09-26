import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

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
    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
