import { Pipe, PipeTransform } from '@angular/core';

const FIELD_CLASSES = 'text-gray-50 bg-amber-800 p-1 rounded';

const VALUE_CLASSES = 'text-gray-50 bg-indigo-700 bg-amber-800 p-1 rounded';

const IF_CLASSES = `text-gray-50 rounded-l p-1 bg-lime-400`;

const THEN_ELSE_CLASSES = 'text-gray-50 rounded p-1 bg-lime-400';

const ENDIF_CLASSES = 'text-gray-50 rounded-r p-1 bg-lime-400';

@Pipe({
  name: 'safeReadableCalculatedField',
})
export class ReadableCalculatedFieldPipe implements PipeTransform {
  transform(value: string | null): string | null {
    let html = value;
    html =
      html?.replace(
        '{{data.bool}}',
        `<span class="${FIELD_CLASSES}">$bool</span>`
      ) || null;
    html =
      html?.replace('{{calc.if(', `<span class="${IF_CLASSES}">IF</span>`) ||
      null;
    html =
      html?.replace(';', `<span class="${THEN_ELSE_CLASSES}">THEN</span>`) ||
      null;
    html =
      html?.replace(';', `<span class="${THEN_ELSE_CLASSES}">ELSE</span>`) ||
      null;
    html =
      html?.replace(')}}', `<span class="${ENDIF_CLASSES}">ENDIF</span>`) || null;
    html =
      html?.replace(`'yes'`, `<span class="${VALUE_CLASSES}">yes</span>`) ||
      null;
    html =
      html?.replace(`'no'`, `<span class="${VALUE_CLASSES}">no</span>`) || null;
    return html;
  }
}
