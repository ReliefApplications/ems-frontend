import { isSafeUrl } from './safe-url';

describe('isSafeUrl (M-01)', () => {
  it.each([
    'https://who.int/page?x=1#y',
    'http://intranet.local/',
    'mailto:someone@who.int',
    'tel:+41227912111',
    './applications/abc/pages/def',
    '/dashboard',
    '?tab=2',
    '#section',
    'applications/abc',
    'page?x=1',
    // Protocol-relative: resolves to an external http(s) page, like any allowed absolute link
    '//partner.example/x',
  ])('allows %s', (href) => {
    expect(isSafeUrl(href)).toBe(true);
  });

  const refused: [any, string][] = [
    ['javascript:alert(document.cookie)', 'javascript scheme'],
    ['JavaScript:alert(1)', 'mixed case javascript scheme'],
    ['  javascript:alert(1)', 'leading spaces'],
    ['java\tscript:alert(1)', 'tab inside the scheme'],
    ['data:text/html,<script>alert(1)</script>', 'data url'],
    ['vbscript:msgbox(1)', 'vbscript'],
    ['file:///etc/passwd', 'file url'],
    ['', 'empty'],
    [null, 'null'],
    [undefined, 'undefined'],
  ];
  it.each(refused)('refuses %s (%s)', (href) => {
    expect(isSafeUrl(href as any)).toBe(false);
  });
});
