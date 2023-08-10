import { TestBed } from '@angular/core/testing';
import { SafeConfirmService } from './confirm.service';
import { DialogModule } from '@angular/cdk/dialog';

describe('ConfirmService', () => {
  let service: SafeConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DialogModule] });
    service = TestBed.inject(SafeConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
