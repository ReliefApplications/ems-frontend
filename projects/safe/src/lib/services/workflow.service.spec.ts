import { TestBed } from '@angular/core/testing';

import { SafeWorkflowService } from './workflow.service';

describe('SafeWorkflowService', () => {
  let service: SafeWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
