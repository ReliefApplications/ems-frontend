import { TestBed } from '@angular/core/testing';
import { SafeDateTranslateService } from '../../services/date-translate/date-translate.service';
import { SafeDatePipe } from './date.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeDatePipe', () => {
  let pipe: SafeDatePipe;
  let translate: SafeDateTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeDateTranslateService],
      imports: [TranslateModule.forRoot()],
    });
    translate = TestBed.inject(SafeDateTranslateService);
    pipe = new SafeDatePipe(translate);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
