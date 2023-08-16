import { TestBed } from '@angular/core/testing';
import { SafeDateTranslateService } from './date-translate.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('SafeDateTranslateService', () => {
  let service: SafeDateTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateService],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(SafeDateTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
