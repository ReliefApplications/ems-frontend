import { TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { KendoTranslationService } from './kendo-translation.service';

describe('KendoTranslationService', () => {
  let service: KendoTranslationService;

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
    service = TestBed.inject(KendoTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
