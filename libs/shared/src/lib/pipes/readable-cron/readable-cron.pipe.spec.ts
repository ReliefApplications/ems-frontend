import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ReadableCronPipe } from './readable-cron.pipe';
import { TestBed } from '@angular/core/testing';

describe('ReadableCronPipe', () => {
  let pipe: ReadableCronPipe;
  let translate: TranslateService;

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
    translate = TestBed.inject(TranslateService);
    pipe = new ReadableCronPipe(translate);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
