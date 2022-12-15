import { SafePlaceholderPipe } from './placeholder.pipe';

describe('PlaceholderPipe', () => {
  it('create an instance', () => {
    const pipe = new SafePlaceholderPipe();
    expect(pipe).toBeTruthy();
  });
});
