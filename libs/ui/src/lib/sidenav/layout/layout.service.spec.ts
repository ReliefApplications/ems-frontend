import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UILayoutService } from './layout.service';

describe('UILayoutService', () => {
  let service: UILayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(UILayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
