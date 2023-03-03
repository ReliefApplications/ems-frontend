import { ReadableCronPipe } from './readable-cron.pipe';

describe('ReadableCronPipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableCronPipe();
    expect(pipe).toBeTruthy();
  });
});
