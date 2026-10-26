import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Change } from '../../models/records-history.model';
import { ReadableHistoryValuePipe } from '../../pipes/readable-history-value/readable-history-value.pipe';

/** Rendered HTML versions of a change's values */
export interface RenderedHistoryValues {
  oldHtml: string;
  newHtml: string;
  expandable: boolean;
}

/** Highlighted HTML versions of a change's values */
type HighlightedHistoryValues = Pick<
  RenderedHistoryValues,
  'oldHtml' | 'newHtml'
>;

/** CSS class used to highlight changed text segments */
const HISTORY_VALUE_HIGHLIGHT_CLASS = 'history-value-highlight';

/** CSS class used to highlight text removed from the old value */
const HISTORY_VALUE_REMOVED_CLASS = 'history-value-highlight-removed';

/** CSS class used to highlight text added to the new value */
const HISTORY_VALUE_ADDED_CLASS = 'history-value-highlight-added';

/** Minimum value length before changed segments are highlighted */
const HISTORY_VALUE_HIGHLIGHT_MIN_LENGTH = 30;

/** Minimum value length before table values are collapsed */
const HISTORY_VALUE_COLLAPSE_MIN_LENGTH = 240;

/** Minimum line count before table values are collapsed */
const HISTORY_VALUE_COLLAPSE_MIN_LINES = 4;

/**
 * Checks if a value is a non-null object.
 *
 * @param value Value to check
 * @returns True when the value is an object
 */
const isObjectValue = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

/**
 * Renders record history changes as safe HTML, shared by the table and cards
 * displays of the history.
 */
@Injectable({
  providedIn: 'root',
})
export class RecordHistoryValueService {
  /** Readable history value pipe */
  private readableHistoryValue: ReadableHistoryValuePipe;

  /**
   * Renders record history changes as safe HTML, shared by the table and cards
   * displays of the history.
   *
   * @param translate Angular translation service
   * @param document Document
   */
  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.readableHistoryValue = new ReadableHistoryValuePipe(this.translate);
  }

  /**
   * Get HTML for type chip
   *
   * @param change The field change object
   * @returns the HTML for the chip
   */
  getChipFromChange(change: Change) {
    return `
      <span class="${change.type}-field">
        ${this.escapeHtml(
          this.translate.instant(`components.history.changes.${change.type}`)
        )}
      </span>
    `;
  }

  /**
   * Parses, formats and highlights the old/new values of a history change.
   *
   * @param change The field change object
   * @returns Plain text and highlighted HTML versions of the values
   */
  getRenderedHistoryValues(change: Change): RenderedHistoryValues {
    const oldText = this.parseHistoryValue(change.old);
    const newText = this.parseHistoryValue(change.new);
    const shouldHighlight =
      oldText.length >= HISTORY_VALUE_HIGHLIGHT_MIN_LENGTH ||
      newText.length >= HISTORY_VALUE_HIGHLIGHT_MIN_LENGTH;
    const expandable =
      this.isExpandableHistoryValue(oldText) ||
      this.isExpandableHistoryValue(newText);

    if (change.type !== 'modify' || !shouldHighlight) {
      return {
        oldHtml: this.escapeHtml(oldText),
        newHtml: this.escapeHtml(newText),
        expandable,
      };
    }

    return {
      ...this.highlightChangedValues(oldText, newText),
      expandable,
    };
  }

  /**
   * Escapes a value before it is inserted into component-generated HTML.
   *
   * @param value Plain text value
   * @returns HTML-escaped text
   */
  escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Checks whether a table value should be collapsed by default.
   *
   * @param value Plain text value
   * @returns True when the value is long enough to collapse
   */
  private isExpandableHistoryValue(value: string): boolean {
    return (
      value.length > HISTORY_VALUE_COLLAPSE_MIN_LENGTH ||
      value.split(/\r\n|\r|\n/).length > HISTORY_VALUE_COLLAPSE_MIN_LINES
    );
  }

  /**
   * Parses a JSON-encoded history value and converts it to readable plain text,
   * reusing the existing readable history pipe for object and object-array values.
   *
   * @param value JSON-encoded history value
   * @returns Readable plain text value
   */
  private parseHistoryValue(value?: string): string {
    if (!value) {
      return '';
    }

    const parsedValue = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      if (parsedValue.length > 0 && !isObjectValue(parsedValue[0])) {
        return this.stripHtml(parsedValue.join(', '));
      }
      return this.readableHistoryValueToText(
        this.readableHistoryValue.transform(parsedValue)
      );
    }

    if (isObjectValue(parsedValue)) {
      return this.readableHistoryValueToText(
        this.readableHistoryValue.transform(parsedValue)
      );
    }

    if (parsedValue === null) {
      return 'null';
    }

    return this.stripHtml(String(parsedValue));
  }

  /**
   * Converts the readable history pipe output into display text.
   *
   * @param value Readable history value pipe output
   * @returns Plain text value
   */
  private readableHistoryValueToText(value: unknown): string {
    if (Array.isArray(value)) {
      return value
        .map((item) => this.readableHistoryValueToText(item).trim())
        .filter(Boolean)
        .join('\n');
    }

    if (value === null || value === undefined) {
      return '';
    }

    return this.stripHtml(String(value));
  }

  /**
   * Removes HTML tags from a value while preserving readable line breaks.
   *
   * @param value Value that may contain HTML markup
   * @returns Plain text value
   */
  private stripHtml(value: string): string {
    let strippedValue = value;
    for (let i = 0; i < 3; i += 1) {
      const nextValue = this.stripHtmlTags(
        this.decodeHtmlEntities(strippedValue)
      );
      if (nextValue === strippedValue) {
        return nextValue;
      }
      strippedValue = nextValue;
    }
    return strippedValue;
  }

  /**
   * Decodes HTML entities so escaped tags like &lt;p&gt; can be stripped too.
   *
   * @param value Value that may contain HTML entities
   * @returns Decoded value
   */
  private decodeHtmlEntities(value: string): string {
    const textarea = this.document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  /**
   * Removes actual HTML tags from a value while preserving readable line breaks.
   *
   * @param value Value that may contain actual HTML markup
   * @returns Plain text value
   */
  private stripHtmlTags(value: string): string {
    const valueWithBreaks = value
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(div|p|li|tr|h[1-6])>/gi, '\n')
      .replace(/<\/(td|th)>/gi, ' ');
    const helperDiv = this.document.createElement('div');
    helperDiv.innerHTML = valueWithBreaks;
    helperDiv.querySelectorAll('script, style').forEach((element) => {
      element.remove();
    });
    return (helperDiv.textContent || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Highlights the changed segment between two text values.
   *
   * @param oldText Previous value
   * @param newText New value
   * @returns Highlighted HTML for both values
   */
  private highlightChangedValues(
    oldText: string,
    newText: string
  ): HighlightedHistoryValues {
    if (oldText === newText) {
      return {
        oldHtml: this.escapeHtml(oldText),
        newHtml: this.escapeHtml(newText),
      };
    }

    const oldChars = Array.from(oldText);
    const newChars = Array.from(newText);
    let start = 0;
    while (
      start < oldChars.length &&
      start < newChars.length &&
      oldChars[start] === newChars[start]
    ) {
      start += 1;
    }

    let oldEnd = oldChars.length - 1;
    let newEnd = newChars.length - 1;
    while (
      oldEnd >= start &&
      newEnd >= start &&
      oldChars[oldEnd] === newChars[newEnd]
    ) {
      oldEnd -= 1;
      newEnd -= 1;
    }

    return {
      oldHtml: this.renderHighlightedValue(
        oldChars,
        start,
        oldEnd,
        HISTORY_VALUE_REMOVED_CLASS
      ),
      newHtml: this.renderHighlightedValue(
        newChars,
        start,
        newEnd,
        HISTORY_VALUE_ADDED_CLASS
      ),
    };
  }

  /**
   * Renders one value with the changed character range wrapped in a mark.
   *
   * @param chars Value split into characters
   * @param start First changed character index
   * @param end Last changed character index
   * @param changeClass Class indicating whether the segment was added or removed
   * @returns HTML string with highlighted changed text
   */
  private renderHighlightedValue(
    chars: string[],
    start: number,
    end: number,
    changeClass: string
  ): string {
    if (start > end) {
      return this.escapeHtml(chars.join(''));
    }

    const prefix = chars.slice(0, start).join('');
    const changed = chars.slice(start, end + 1).join('');
    const suffix = chars.slice(end + 1).join('');

    return `${this.escapeHtml(
      prefix
    )}<mark class="${HISTORY_VALUE_HIGHLIGHT_CLASS} ${changeClass}">${this.escapeHtml(
      changed
    )}</mark>${this.escapeHtml(suffix)}`;
  }
}
