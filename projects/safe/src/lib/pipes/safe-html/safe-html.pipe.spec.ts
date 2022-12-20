import { SafeSafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeSafeHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
