/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const END_COMMENT = /-->/g;
const END_COMMENT_ESCAPED = '-\u200B-\u200B>';
/**
 * Escape the content of the strings so that it can be safely inserted into a comment node.
 *
 * The issue is that HTML does not specify any way to escape comment end text inside the comment.
 * `<!-- The way you close a comment is with "-->". -->`. Above the `"-->"` is meant to be text not
 * an end to the comment. This can be created programmatically through DOM APIs.
 *
 * ```
 * div.innerHTML = div.innerHTML
 * ```
 *
 * One would expect that the above code would be safe to do, but it turns out that because comment
 * text is not escaped, the comment may contain text which will prematurely close the comment
 * opening up the application for XSS attack. (In SSR we programmatically create comment nodes which
 * may contain such text and expect them to be safe.)
 *
 * This function escapes the comment text by looking for the closing char sequence `-->` and replace
 * it with `-_-_>` where the `_` is a zero width space `\u200B`. The result is that if a comment
 * contains `-->` text it will render normally but it will not cause the HTML parser to close the
 * comment.
 *
 * @param value text to make safe for comment node by escaping the comment close character sequence
 */
export function escapeCommentText(value) {
    return value.replace(END_COMMENT, END_COMMENT_ESCAPED);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvdXRpbC9kb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQzNCLE1BQU0sbUJBQW1CLEdBQUcsaUJBQWlCLENBQUM7QUFFOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBYTtJQUM3QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBFTkRfQ09NTUVOVCA9IC8tLT4vZztcbmNvbnN0IEVORF9DT01NRU5UX0VTQ0FQRUQgPSAnLVxcdTIwMEItXFx1MjAwQj4nO1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgY29udGVudCBvZiB0aGUgc3RyaW5ncyBzbyB0aGF0IGl0IGNhbiBiZSBzYWZlbHkgaW5zZXJ0ZWQgaW50byBhIGNvbW1lbnQgbm9kZS5cbiAqXG4gKiBUaGUgaXNzdWUgaXMgdGhhdCBIVE1MIGRvZXMgbm90IHNwZWNpZnkgYW55IHdheSB0byBlc2NhcGUgY29tbWVudCBlbmQgdGV4dCBpbnNpZGUgdGhlIGNvbW1lbnQuXG4gKiBgPCEtLSBUaGUgd2F5IHlvdSBjbG9zZSBhIGNvbW1lbnQgaXMgd2l0aCBcIi0tPlwiLiAtLT5gLiBBYm92ZSB0aGUgYFwiLS0+XCJgIGlzIG1lYW50IHRvIGJlIHRleHQgbm90XG4gKiBhbiBlbmQgdG8gdGhlIGNvbW1lbnQuIFRoaXMgY2FuIGJlIGNyZWF0ZWQgcHJvZ3JhbW1hdGljYWxseSB0aHJvdWdoIERPTSBBUElzLlxuICpcbiAqIGBgYFxuICogZGl2LmlubmVySFRNTCA9IGRpdi5pbm5lckhUTUxcbiAqIGBgYFxuICpcbiAqIE9uZSB3b3VsZCBleHBlY3QgdGhhdCB0aGUgYWJvdmUgY29kZSB3b3VsZCBiZSBzYWZlIHRvIGRvLCBidXQgaXQgdHVybnMgb3V0IHRoYXQgYmVjYXVzZSBjb21tZW50XG4gKiB0ZXh0IGlzIG5vdCBlc2NhcGVkLCB0aGUgY29tbWVudCBtYXkgY29udGFpbiB0ZXh0IHdoaWNoIHdpbGwgcHJlbWF0dXJlbHkgY2xvc2UgdGhlIGNvbW1lbnRcbiAqIG9wZW5pbmcgdXAgdGhlIGFwcGxpY2F0aW9uIGZvciBYU1MgYXR0YWNrLiAoSW4gU1NSIHdlIHByb2dyYW1tYXRpY2FsbHkgY3JlYXRlIGNvbW1lbnQgbm9kZXMgd2hpY2hcbiAqIG1heSBjb250YWluIHN1Y2ggdGV4dCBhbmQgZXhwZWN0IHRoZW0gdG8gYmUgc2FmZS4pXG4gKlxuICogVGhpcyBmdW5jdGlvbiBlc2NhcGVzIHRoZSBjb21tZW50IHRleHQgYnkgbG9va2luZyBmb3IgdGhlIGNsb3NpbmcgY2hhciBzZXF1ZW5jZSBgLS0+YCBhbmQgcmVwbGFjZVxuICogaXQgd2l0aCBgLV8tXz5gIHdoZXJlIHRoZSBgX2AgaXMgYSB6ZXJvIHdpZHRoIHNwYWNlIGBcXHUyMDBCYC4gVGhlIHJlc3VsdCBpcyB0aGF0IGlmIGEgY29tbWVudFxuICogY29udGFpbnMgYC0tPmAgdGV4dCBpdCB3aWxsIHJlbmRlciBub3JtYWxseSBidXQgaXQgd2lsbCBub3QgY2F1c2UgdGhlIEhUTUwgcGFyc2VyIHRvIGNsb3NlIHRoZVxuICogY29tbWVudC5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgdGV4dCB0byBtYWtlIHNhZmUgZm9yIGNvbW1lbnQgbm9kZSBieSBlc2NhcGluZyB0aGUgY29tbWVudCBjbG9zZSBjaGFyYWN0ZXIgc2VxdWVuY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUNvbW1lbnRUZXh0KHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShFTkRfQ09NTUVOVCwgRU5EX0NPTU1FTlRfRVNDQVBFRCk7XG59Il19