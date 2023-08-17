import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SafeLayoutService } from './layout.service';

describe('SafeLayoutService', () => {
  let service: SafeLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(SafeLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
