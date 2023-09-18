import { TestBed } from '@angular/core/testing';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { DatePipe } from './date.pipe';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('DatePipe', () => {
  let pipe: DatePipe;
  let translate: DateTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateTranslateService, TranslateService],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    translate = TestBed.inject(DateTranslateService);
    pipe = new DatePipe(translate);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
