/** URL schemes a user-configured link may navigate to */
const ALLOWED_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Whether a user-configured link (action button, template link) is safe to
 * navigate to: a relative path, or an absolute URL using an allowed scheme.
 * `javascript:`, `data:`, `vbscript:` and similar URLs would run code or load
 * attacker content in the session of whoever clicks.
 *
 * @param href link to check, as rendered
 * @returns true when navigation is allowed
 */
export const isSafeUrl = (href: string | null | undefined): boolean => {
  if (!href) {
    return false;
  }
  const value = href.trim();
  // Relative navigation (inside the application or the current origin)
  if (/^[./?#]/.test(value) && !/^\/\//.test(value)) {
    return true;
  }
  try {
    const { protocol } = new URL(value, window.location.origin);
    return ALLOWED_SCHEMES.includes(protocol);
  } catch {
    return false;
  }
};
