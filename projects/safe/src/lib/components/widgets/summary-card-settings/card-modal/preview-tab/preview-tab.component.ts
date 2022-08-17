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
      this.formattedHtml = this.applyOperations(
        this.replaceRecordFields(this.html, this.record)
      );
    } else {
      this.formattedHtml = this.applyOperations(this.html);
    }
  }

  /**
   * Apply the calc functions on the html body.
   *
   * @param html The html body on which we want to apply the functions
   * @returns The html body with the calculated result of the functions
   */
  private applyOperations(html: string): string {
    const regex = /@calc\.(\w+)\(([^\)]+)\)/gm;
    let parsedHtml = html;
    let result = regex.exec(parsedHtml);
    while (result !== null) {
      const calcFunc = this.getCalcFunction(result[1]);
      const args = result[2]
        .split(';')
        .map((arg) => arg.replace(/[\s,]/gm, '')); // remove spaces and commas
      const resultText = calcFunc(...args);
      parsedHtml = parsedHtml.replace(result[0], resultText);
      result = regex.exec(parsedHtml);
    }
    return parsedHtml;
  }

  /**
   * Get the function corresponding to the operation
   *
   * @param funcName The name of the function
   * @returns A function corresponding to the operation
   */
  private getCalcFunction(funcName: string): (...args: string[]) => string {
    switch (funcName) {
      case 'round':
        return (value, digit = '0') => {
          try {
            const parsedValue = parseFloat(value);
            const parsedDigit = parseInt(digit, 10);
            if (isNaN(parsedValue) || isNaN(parsedDigit))
              throw new Error('Not a number');
            return parsedValue.toFixed(parsedDigit);
          } catch (err) {
            return `[@calc.round ${err}]`;
          }
        };
      case 'percentage':
        return (value, total = '1', digit = '2') => {
          try {
            const percent = (parseFloat(value) / parseFloat(total)) * 100;
            const parsedDigit = parseInt(digit, 10);
            if (isNaN(percent) || isNaN(parsedDigit))
              throw new Error('Not a number');
            return percent.toFixed(parsedDigit) + '%';
          } catch (err) {
            return `[@calc.percentage ${err}]`;
          }
        };
      default:
        return () => `[@calc.${funcName} is unknown]`;
    }
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
