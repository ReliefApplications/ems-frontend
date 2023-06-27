import { TestBed } from '@angular/core/testing';

import { DataTemplateService } from './data-template.service';

describe('DataTemplateService', () => {
  let service: DataTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
