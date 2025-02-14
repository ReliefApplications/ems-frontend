import { TestBed } from '@angular/core/testing';
import { AssetPipe } from './asset.pipe';

describe('AssetPipe', () => {
  let pipe: AssetPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssetPipe,
        { provide: 'environment', useValue: { href: 'https://example.com/' } },
      ],
    });
    pipe = TestBed.inject(AssetPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should prepend the href to the asset path', () => {
    const assetPath = 'assets/image.png';
    expect(pipe.transform(assetPath)).toBe(
      'https://example.com/assets/image.png'
    );
  });

  it('should handle empty asset path', () => {
    const assetPath = '';
    expect(pipe.transform(assetPath)).toBe('https://example.com/');
  });

  it('should handle asset path starting with a slash', () => {
    const assetPath = '/assets/image.png';
    expect(pipe.transform(assetPath)).toBe(
      'https://example.com//assets/image.png'
    );
  });

  it('should handle a null environment href gracefully', () => {
    const localPipe = new AssetPipe({ href: null });
    const assetPath = 'assets/image.png';
    expect(localPipe.transform(assetPath)).toBe('assets/image.png');
  });

  it('should handle an undefined environment href gracefully', () => {
    const localPipe = new AssetPipe({});
    const assetPath = 'assets/image.png';
    expect(localPipe.transform(assetPath)).toBe('assets/image.png');
  });
});
