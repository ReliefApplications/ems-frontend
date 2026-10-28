import { sanitizeHtml } from './sanitize-html';

describe('sanitizeHtml (M-01)', () => {
  it.each([
    ['<p>hello</p><script>alert(1)</script>', '<p>hello</p>'],
    ['<img src="x" onerror="alert(1)">', '<img src="x">'],
    ['<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
    [
      '<svg><foreignObject><body onload="alert(1)"></body></foreignObject></svg>',
      '<svg></svg>',
    ],
    [
      '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
      '<iframe></iframe>',
    ],
    ['<div onclick="steal()">x</div>', '<div>x</div>'],
    ['<object data="x.swf"></object>', ''],
    ['<form action="https://evil.example"><input name="token"></form>', ''],
  ])('removes active content from %p', (input, expected) => {
    expect(sanitizeHtml(input)).toBe(expected);
  });

  it('keeps formatting, styles, classes, data attributes, images and links', () => {
    const html =
      '<p style="color: red; text-align: center;" class="title" data-record-id="abc">Hi <strong>there</strong></p>' +
      '<img src="https://cdn.example/a.png" alt="a" width="10">' +
      '<a href="https://who.int/page?x=1#y">link</a>' +
      '<ul><li>item</li></ul><table><tbody><tr><td>cell</td></tr></tbody></table>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('keeps embeds and forces noopener on links opening a new tab', () => {
    expect(
      sanitizeHtml(
        '<iframe src="https://www.youtube.com/embed/x" allowfullscreen frameborder="0"></iframe>'
      )
    ).toBe(
      '<iframe src="https://www.youtube.com/embed/x" allowfullscreen="" frameborder="0"></iframe>'
    );
    expect(
      sanitizeHtml('<a href="https://who.int" target="_blank">x</a>')
    ).toBe(
      '<a href="https://who.int" target="_blank" rel="noopener noreferrer">x</a>'
    );
  });

  it('keeps the markup produced by the editor for record buttons and file links', () => {
    const html =
      '<span class="record-editor" data-record="abc" data-form="def">Edit</span>' +
      '<button type="file" field="attachments" index="0" title="report.pdf">download</button>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('returns an empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
  });
});
