import { TestBed } from '@angular/core/testing';

import { GridWidgetService } from './grid-widget.service';

describe('GridWidgetService', () => {
  let service: GridWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
