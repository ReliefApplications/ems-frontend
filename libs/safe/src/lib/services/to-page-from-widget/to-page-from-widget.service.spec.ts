import { TestBed } from '@angular/core/testing';

import { ToPageFromWidgetService } from './to-page-from-widget.service';

describe('ToPageFromWidgetService', () => {
  let service: ToPageFromWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToPageFromWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
