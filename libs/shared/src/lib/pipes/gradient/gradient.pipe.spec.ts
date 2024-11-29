import { GradientPipe } from './gradient.pipe';

describe('GradientPipe', () => {
  let pipe: GradientPipe;

  beforeEach(() => {
    pipe = new GradientPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if value is undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return an empty string if value is null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return a linear gradient with default direction if degrees is not provided', () => {
    const gradient = [
      { color: 'red', ratio: 0 },
      { color: 'blue', ratio: 1 },
    ];
    expect(pipe.transform(gradient)).toBe(
      'linear-gradient(to left, red 0%, blue 100%)'
    );
  });

  it('should return a linear gradient with specified degrees', () => {
    const gradient = [
      { color: 'red', ratio: 0 },
      { color: 'blue', ratio: 1 },
    ];
    expect(pipe.transform(gradient, 45)).toBe(
      'linear-gradient(45deg, red 0%, blue 100%)'
    );
  });

  it('should sort the gradient values by ratio before applying', () => {
    const gradient = [
      { color: 'blue', ratio: 1 },
      { color: 'red', ratio: 0 },
    ];
    expect(pipe.transform(gradient)).toBe(
      'linear-gradient(to left, red 0%, blue 100%)'
    );
  });

  it('should handle a gradient with multiple colors and ratios', () => {
    const gradient = [
      { color: 'red', ratio: 0 },
      { color: 'green', ratio: 0.5 },
      { color: 'blue', ratio: 1 },
    ];
    expect(pipe.transform(gradient)).toBe(
      'linear-gradient(to left, red 0%, green 50%, blue 100%)'
    );
  });

  it('should handle a gradient with duplicate ratios', () => {
    const gradient = [
      { color: 'red', ratio: 0.5 },
      { color: 'green', ratio: 0.5 },
      { color: 'blue', ratio: 1 },
    ];
    expect(pipe.transform(gradient)).toBe(
      'linear-gradient(to left, red 50%, green 50%, blue 100%)'
    );
  });

  it('should handle a gradient with a single color and ratio', () => {
    const gradient = [{ color: 'red', ratio: 0.5 }];
    expect(pipe.transform(gradient)).toBe('linear-gradient(to left, red 50%)');
  });

  it('should handle a gradient with degrees and a single color', () => {
    const gradient = [{ color: 'red', ratio: 0.5 }];
    expect(pipe.transform(gradient, 90)).toBe(
      'linear-gradient(90deg, red 50%)'
    );
  });
});
