import { SafeDatePipe } from './date.pipe';

describe('SafeDatePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeDatePipe();
    expect(pipe).toBeTruthy();
  });
});
