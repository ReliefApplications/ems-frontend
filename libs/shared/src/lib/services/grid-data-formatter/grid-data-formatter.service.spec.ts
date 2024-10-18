import { TestBed } from '@angular/core/testing';
import { GridDataFormatterService } from './grid-data-formatter.service';

describe('GridDataFormatterService', () => {
  let service: GridDataFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridDataFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
