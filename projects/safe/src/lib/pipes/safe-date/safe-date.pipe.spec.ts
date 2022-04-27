import { SafeDatePipe } from './safe-date.pipe';
import { TranslateService } from '@ngx-translate/core';

describe('SafeDatePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeDatePipe();
    expect(pipe).toBeTruthy();
  });
});
