import { TestBed } from '@angular/core/testing';

import { WhoWorkflowService } from './workflow.service';

describe('WhoWorkflowService', () => {
  let service: WhoWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhoWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
