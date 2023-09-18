import { TestBed } from '@angular/core/testing';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { DatePipe as AngularDatePipe } from './date.pipe';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('DatePipe', () => {
  let pipe: DatePipe as AngularDatePipe;
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
    pipe = new DatePipe as AngularDatePipe(translate);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
