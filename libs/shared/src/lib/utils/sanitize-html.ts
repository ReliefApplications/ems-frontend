import DOMPurify from 'dompurify';

/**
 * Elements allowed on top of DOMPurify's defaults: embeds (videos, external
 * pages) are a feature of text widgets and email templates.
 */
const ADDED_TAGS = ['iframe'];

/** Attributes allowed on top of DOMPurify's defaults */
const ADDED_ATTRIBUTES = [
  'target',
  'allow',
  'allowfullscreen',
  'frameborder',
  'scrolling',
  // Markers set by the html parser on file buttons, read back on click
  'field',
  'index',
];

/**
 * Attributes always removed, even on allowed elements: srcdoc would let an
 * iframe run inline markup in our origin.
 */
const FORBIDDEN_ATTRIBUTES = ['srcdoc'];

/**
 * Elements removed although DOMPurify allows them: a form in a text widget can
 * only serve to phish credentials out of the page, surveys have their own rendering.
 */
const FORBIDDEN_TAGS = ['form', 'input', 'textarea', 'select', 'option'];

/** DOMPurify instance configured once for the application */
const purifier = DOMPurify();
purifier.setConfig({
  ADD_TAGS: ADDED_TAGS,
  ADD_ATTR: ADDED_ATTRIBUTES,
  FORBID_TAGS: FORBIDDEN_TAGS,
  FORBID_ATTR: FORBIDDEN_ATTRIBUTES,
  // Keep the output a plain string of body content (no <html>/<body> wrapper)
  WHOLE_DOCUMENT: false,
});
// Links opening a new tab must not hand our window to the target page
purifier.addHook('afterSanitizeAttributes', (node) => {
  if (node.hasAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Sanitises HTML authored by users or editors before it is rendered in the page.
 *
 * Removes scripts, event handlers, `javascript:` URLs and other active content,
 * while keeping formatting (tags, classes, inline styles, data attributes),
 * images, links and embeds. Use it on any HTML that reaches `innerHTML` or
 * `bypassSecurityTrustHtml`, whatever the privileges of its author: dashboard
 * and form editors must not be able to run code in other users' sessions.
 *
 * @param html html to sanitise
 * @returns safe html
 */
export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) {
    return '';
  }
  return purifier.sanitize(html) as string;
};
