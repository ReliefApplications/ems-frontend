import { TestBed } from '@angular/core/testing';
import { SafeDateTranslateService } from './date-translate.service';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeDateTranslateService', () => {
  let service: SafeDateTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(SafeDateTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
