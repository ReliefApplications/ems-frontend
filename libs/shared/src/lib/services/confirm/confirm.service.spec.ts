import { TestBed } from '@angular/core/testing';
import { ConfirmService } from './confirm.service';
import { DialogModule } from '@angular/cdk/dialog';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DialogModule] });
    service = TestBed.inject(ConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
