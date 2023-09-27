import { TestBed } from '@angular/core/testing';
import { DateTranslateService } from './date-translate.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('DateTranslateService', () => {
  let service: DateTranslateService;

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
    service = TestBed.inject(DateTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
