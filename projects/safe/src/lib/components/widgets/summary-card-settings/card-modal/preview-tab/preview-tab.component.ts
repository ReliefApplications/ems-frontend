import { Component, Input, OnChanges } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Record } from '../../../../../models/record.model';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
})
export class SafePreviewTabComponent implements OnChanges {
  @Input() html = '';
  @Input() record: Record | null = null;

  public formattedHtml: string = this.html;

  /**
   * Constructor used by the SafePreviewTab component.
   *
   * @param apollo Service used for getting the record queries.
   */
  constructor(private apollo: Apollo) {}

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    if (this.record) {
      this.formattedHtml = this.applyOperations(this.replaceRecordFields(this.html, this.record));
    } else {
      this.formattedHtml = this.applyOperations(this.html);

    }
  }

  private applyOperations(html: string): string {
    // Round operations
    const roundRegex = new RegExp('@\\bcalc.round\\b');
    // for(let pos = html.search(roundRegex); pos >= 0;) {
    //   const params = html.slice(html.indexOf('(', pos) + 1, html.indexOf(')', pos)).split(/,\s*/);
    //   if (params.length > 2 || params.length < 2 || isNaN(parseFloat(params[0]))) {
    //     html = html.replace(roundRegex, '@calc.round error: Bad parameter');
    //   } else if (isNaN(parseFloat(params[1]))) {
    //     html = html.replace(roundRegex, params[0]);
    //   } else {
    //     html = html.replace(roundRegex, parseFloat(params[0]).toFixed(parseInt(params[1])).toString());
    //   }
    //   pos = html.search(roundRegex);
    //   console.log(html);
    // }
    return html;
  }

  /**
   * Replaces the html resource fields with the resource data.
   *
   * @param html String with the content html.
   * @param record Record object.
   * @returns formatted html
   */
  private replaceRecordFields(html: string, record: any): string {
    const fields = this.getFieldsValue(record);
    let formattedHtml = html;
    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        const regex = new RegExp(`@\\bdata.${key}\\b`, 'gi');
        formattedHtml = formattedHtml.replace(regex, value as string);
      }
    }
    return formattedHtml;
  }

  /**
   * Returns an object with the record data keys paired with the values.
   *
   * @param record Record object.
   * @returns fields
   */
  private getFieldsValue(record: any) {
    const fields: any = {};
    for (const [key, value] of Object.entries(record)) {
      if (!key.startsWith('__') && key !== 'form') {
        if (value instanceof Object) {
          for (const [key2, value2] of Object.entries(value)) {
            if (!key2.startsWith('__')) {
              fields[(key === 'data' ? '' : key + '.') + key2] = value2;
            }
          }
        } else {
          fields[key] = value;
        }
      }
    }
    return fields;
  }
}
