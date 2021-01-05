import { TestBed } from '@angular/core/testing';

import { QueryBuilderService } from './query-builder.service';

describe('QueryBuilderService', () => {
  let service: QueryBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
