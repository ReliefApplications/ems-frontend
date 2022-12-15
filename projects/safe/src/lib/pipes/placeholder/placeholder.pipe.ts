import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/** Interface for a placeholder definition */
interface Placeholder {
  match: RegExp;
  replace: string;
  color: string;
  numParams?: number;
}

/**
 * List of placeholders
 *
 * Replacement strings with arguments should be defined as:
 * "TRANSLATION $1 $2 $3", where $1, $2, $3 are the arguments
 *  and their order is the same as the order in the regex grouping
 */
const PLACEHOLDERS: Placeholder[] = [
  {
    // {{ dataset }}
    match: /{[&nbsp;|\s]*dataset[&nbsp;|\s]*}/g,
    replace: 'components.placeholders.dataset',
    color: 'rgb(59 130 246)',
  },
  {
    // {{ now }}
    match: /{[&nbsp;|\s]*now[&nbsp;|\s]*}/g,
    replace: 'components.placeholders.now',
    color: 'rgb(249 115 22)',
  },
  {
    // {{ today }}
    match: /{[&nbsp;|\s]*today[&nbsp;|\s]*}/g,
    replace: 'components.placeholders.today',
    color: 'rgb(34 197 94)',
  },
  {
    // {{ today + 1 }} and {{ today - 1 }}
    match:
      /{[&nbsp;|\s]*today[&nbsp;|\s]*(\+|-)[&nbsp;|\s]*(\d+)[&nbsp;|\s]*}/g,
    replace: 'components.placeholders.todayCalc',
    color: 'rgb(168 85 247)',
    numParams: 2,
  },
];

/** Pipe to replace placeholder texts in string */
@Pipe({
  name: 'placeholder',
})
export class SafePlaceholderPipe implements PipeTransform {
  /**
   * Pipe to replace placeholder texts in string
   *
   * @param translate Shared date translation service
   */
  constructor(private translate: TranslateService) {}

  /**
   * Transform string to replace placeholders/restore original text
   *
   * @param value string to replace placeholders/restore original text
   * @param revert If true, replaces the placeholders with the original text
   * @returns string with placeholders replaced/restored
   */
  transform(value: string | null, revert = false): string | null {
    if (!value) {
      return null;
    }

    let html = value;

    // checks if user is trying to delete placeholder
    const deleteReg =
      /<span [^>]*data-placeholder-text="([^"]+)"[^>]*>([^<]+)<\/span>/g;
    html = value.replace(deleteReg, (match, dataAttr, innerText) =>
      dataAttr !== innerText ? '&nbsp;' : match
    );

    // Replace original text with spans
    if (!revert) {
      PLACEHOLDERS.forEach((placeholder) => {
        const replace = this.translate.instant(placeholder.replace);
        if (placeholder.numParams) {
          const numParams = placeholder.numParams;
          html = html.replace(placeholder.match, (...args) => {
            const init = args[0];
            let replaced = replace;
            for (let i = 1; i <= numParams; i++)
              replaced = replaced.replace(`$${i}`, args[i]);
            return this.getSpan(replaced, placeholder.color, init);
          });
        } else {
          html = html.replace(placeholder.match, (matched) =>
            this.getSpan(replace, placeholder.color, matched)
          );
        }
      });
    } else {
      // Replace spans with original text
      const revertReg =
        /<span [^>]*data-orig-value="([^"]+)"[^>]*>[^<]+<\/span>/g;
      html = value.replace(revertReg, (_, origValue) => `{${origValue}}`);
    }
    return html;
  }

  /**
   * Gets a span with the text and color
   *
   * @param text Text to display
   * @param color Color of the span
   * @param value Original value of the placeholder
   * @returns HTML string with the span
   */
  private getSpan(text: string, color: string, value: string): string {
    const val = value
      .replace(/&nbsp;/g, '')
      .slice(1, -1)
      .trim();
    return `<span data-orig-value="${val}" data-placeholder-text="${text}" class="placeholder-chip" style="--bg-color: ${color};">${text}</span>&nbsp;`;
  }
}
