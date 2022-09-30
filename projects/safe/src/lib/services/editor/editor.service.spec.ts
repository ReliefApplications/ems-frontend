import { TestBed } from '@angular/core/testing';

import { SafeEditorService } from './editor.service';

describe('SafeEditorService', () => {
  let service: SafeEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
