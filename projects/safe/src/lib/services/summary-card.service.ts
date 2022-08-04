import { Injectable } from '@angular/core';

/**
 * Summary card service, used to centralize all summary card functions.
 */
@Injectable({
  providedIn: 'root',
})
export class SummaryCardService {
  /**
   * Constructor for summary card Service
   */
  constructor() {}

  /**
   * Replaces the html resource fields with the resource data.
   *
   * @param html String with the content html.
   * @param record Record object.
   * @param layouts Array of layouts which will be applied to the card, by default it's an empty array.
   * @param wholeCardLayouts Boolean indicating if the layouts should be applied to the whole card, by default it's false.
   * @returns Returns the html content with all the styles and fields values applied
   */
  public replaceRecordFields(
    html: string,
    record: any,
    layouts: any[] = [],
    wholeCardLayouts = false
  ): string {
    const fields = this.getFieldsValue(record);
    let formatedHtml = html;
    if (wholeCardLayouts) {
      let lastRowLayout: any = null;
      layouts.map((layout: any) => {
        if (layout.fields.length === 0) {
          lastRowLayout = layout;
        }
      });
      if (lastRowLayout) {
        formatedHtml =
          `<div style='${this.getLayoutStyle(lastRowLayout)}'>` +
          formatedHtml +
          '</div>';
      }
    }
    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        const style = this.getLayoutsStyle(layouts, key, fields);
        const regex = new RegExp(`@\\bdata.${key}\\b`, 'gi');
        formatedHtml = formatedHtml.replace(
          regex,
          `<span style='${style}'>${value}</span>`
        );
      }
    }
    return formatedHtml;
  }

  /**
   * Extracts all the available fields from a record
   *
   * @param record Record to get the fields from
   * @returns Returns an object with all the fields name and value
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

  /**
   * Loops throught the layout styles and returns the last style that pass the filters
   *
   * @param layouts Array of layout styles
   * @param key The key of the actual property in the html
   * @param fields Array of available fields
   * @returns A string with the correct style to apply
   */
  private getLayoutsStyle(layouts: any, key: string, fields: any): string {
    let style = '';
    layouts.map((layout: any) => {
      if (layout.fields.length === 0 || layout.fields.includes(key)) {
        if (this.applyFilters(layout.filter, fields)) {
          style = this.getLayoutStyle(layout);
        }
      }
    });
    return style;
  }

  /**
   * Get the css style of a layout style as a string
   *
   * @param layout Layout style
   * @returns Returns a string with all the styling
   */
  private getLayoutStyle(layout: any): string {
    let style = '';
    if (layout.background.color) {
      style += `background-color: ${layout.background.color}; `;
    }
    if (layout.text.color) {
      style += `color: ${layout.text.color}; `;
    }
    if (layout.text.bold) {
      style += 'font-weight: bold; ';
    }
    if (layout.text.italic) {
      style += 'font-style: italic; ';
    }
    if (layout.text.underline) {
      style += 'text-decoration: underline; ';
    }
    return style;
  }

  /**
   * Apply the filter provided to the specified field
   *
   * @param filter Filter object
   * @param fields Array of fields
   * @returns Returns a boolean with the result of the filter
   */
  private applyFilters(filter: any, fields: any): boolean {
    if (filter.logic) {
      for (let i = 0; filter.filters[i]; i++) {
        if (this.applyFilters(filter.filters[i], fields)) {
          if (filter.logic === 'or') {
            return true;
          }
        } else if (filter.logic === 'and') {
          return false;
        }
      }
      return filter.logic === 'or' ? false : true;
    } else {
      const value = fields[filter.field];
      switch (filter.operator) {
        case 'eq': {
          // equal
          return value === filter.value;
        }
        case 'neq': {
          // not equal
          return value !== filter.value;
        }
        case 'isnull': {
          return value === null;
        }
        case 'isnotnull': {
          return value !== null;
        }
        case 'lt': {
          // lesser
          return value < filter.value;
        }
        case 'lte': {
          // lesser or equal
          return value <= filter.value;
        }
        case 'gt': {
          // greater
          return value > filter.value;
        }
        case 'gte': {
          // greater or equal
          return value >= filter.value;
        }
        case 'startswith': {
          if (!value) {
            return false;
          }
          return value[0] === filter.value;
        }
        case 'endswith': {
          if (!value) {
            return false;
          }
          return value[value.length] === filter.value;
        }
        case 'contains': {
          if (!value) {
            return false;
          }
          for (let i = 0; value[i]; i++) {
            if (value[i] === filter.value) {
              return true;
            }
          }
          return false;
        }
        case 'doesnotcontain': {
          if (!value) {
            return true;
          }
          for (let i = 0; value[i]; i++) {
            if (value[i] === filter.value) {
              return false;
            }
          }
          return true;
        }
        case 'isempty': {
          if (!value) {
            return true;
          }
          return value.length <= 0;
        }
        case 'isnotempty': {
          if (!value) {
            return false;
          }
          return value.length > 0;
        }
        default: {
          return false;
        }
      }
    }
  }
}
