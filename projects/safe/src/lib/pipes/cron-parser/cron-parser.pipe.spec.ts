import { CronParserPipe } from './cron-parser.pipe';

describe('CronParserPipe', () => {
  it('create an instance', () => {
    const pipe = new CronParserPipe();
    expect(pipe).toBeTruthy();
  });
});
