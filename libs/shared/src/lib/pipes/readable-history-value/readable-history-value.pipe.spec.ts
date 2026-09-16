import { TestBed } from '@angular/core/testing';
import { ReadableHistoryValuePipe } from './readable-history-value.pipe';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('ReadableHistoryValuePipe', () => {
  let pipe: ReadableHistoryValuePipe;
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
    pipe = new ReadableHistoryValuePipe(translate);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns primitives as is', () => {
    expect(pipe.transform('value')).toBe('value');
    expect(pipe.transform(2)).toBe(2);
  });

  it('transforms objects into readable strings', () => {
    expect(pipe.transform({ a: 1, b: 'two' })).toEqual(['a (1)', ' b (two)']);
  });

  it('transforms arrays element by element', () => {
    expect(pipe.transform([1, { a: 2 }])).toEqual([1, ['a (2)']]);
  });
});
