import { inject, Injectable } from '@angular/core';
import { get, groupBy, isNil, map } from 'lodash';
import { GridField } from '../../models/grid.model';
import { DatePipe } from '../../pipes/date/date.pipe';
import { HtmlParserService } from '../html-parser/html-parser.service';
import {
  getPropertyValue,
  getStyle,
  getUrl,
} from './grid-data-formatter.helper';
import { getFileIcon, removeFileExtension } from '../file/file.utils';

/**
 * Grid data formatter service
 */
@Injectable({
  providedIn: 'root',
})
export class GridDataFormatterService {
  /**
   * Grid styles helper object
   */
  private styleObj = {
    style: {},
  };
  /**
   * Grid texts helper object
   */
  private textObj = {
    text: {},
  };
  /**
   * Grid icons helper object
   */
  private iconObj = {
    icon: {},
  };
  /**
   * Grid urls helper object
   */
  private urlObj = {
    urlValue: {},
  };
  /**
   * Grid values helper object
   */
  private valueObj = {
    value: {},
  };
  /**
   * Grid row actions
   */
  private actionsObj: { actions: any[] } = {
    actions: [],
  };
  /**
   * Grid full screen button flags helper object
   */
  private showFullScreenButtonObj = {
    showFullScreenButton: {},
  };
  /** Shared date pipe */
  datePipe = inject(DatePipe);

  /**
   * Grid data formatter service
   *
   * @param htmlParserService Html parser service
   */
  constructor(private htmlParserService: HtmlParserService) {}

  /**
   * Init helper fields for grid data formatter
   */
  private initHelperFields() {
    this.styleObj = {
      style: {},
    };
    this.textObj = {
      text: {},
    };
    this.iconObj = {
      icon: {},
    };
    this.urlObj = {
      urlValue: {},
    };
    this.valueObj = {
      value: {},
    };
    this.actionsObj = {
      actions: [],
    };
    this.showFullScreenButtonObj = {
      showFullScreenButton: {},
    };
  }

  /**
   * Format given row data to be suitable suitable for the grid
   *
   * @param rowData Data from grid row
   * @param {GridField[]} fields Grid fields
   */
  public formatGridRowData(rowData: any, fields: GridField[]) {
    this.initHelperFields();
    this.iterateFields(rowData, fields);
    this.actionsObj.actions =
      map(
        groupBy(get(rowData, '_meta.actions', []), 'columnLabel'),
        (actions, label) => ({
          label,
          actions,
        })
      ) || [];
    // General properties
    Object.assign(rowData, this.styleObj);
    Object.assign(rowData, this.textObj);
    Object.assign(rowData, this.actionsObj);
    // Specific types for each field and meta
    Object.assign(rowData, this.iconObj);
    Object.assign(rowData, this.urlObj);
    Object.assign(rowData, this.valueObj);
    Object.assign(rowData, this.showFullScreenButtonObj);
  }

  /**
   * Iterate fields to fill properties.
   *
   * @param rowData Data from grid row
   * @param fields fields to iterate
   * @param parent parent field ( for ref data )
   */
  private iterateFields(rowData: any, fields: GridField[], parent?: GridField) {
    fields
      .filter(
        (field) => !isNil(get(rowData, parent ? parent.name : field.name))
      )
      .forEach((field) => {
        // Reference data
        if (field.subFields && field.meta.type === 'referenceData') {
          this.iterateFields(rowData, field.subFields, field);
        } else {
          // Format styling for each field
          Object.assign(this.styleObj.style, {
            [field.name]: getStyle(rowData, field.name),
          });
          // Format text for each field
          if (!(field.type === 'JSON' && field.meta.type === 'file')) {
            // Format text text for each field
            const text = this.getFieldText(rowData, field, parent);
            Object.assign(this.textObj.text, {
              [field.name]: text,
            });
            // Format url if exists for each field
            if (field.meta.type === 'url') {
              const url = getUrl(getPropertyValue(rowData, field));
              Object.assign(this.urlObj.urlValue, {
                [field.name]: url,
              });
            }
            // Format value for email and telephone if exists for each field
            if (field.meta.type === 'email' || field.meta.type === 'tel') {
              const value = getPropertyValue(rowData, field);
              Object.assign(this.valueObj.value, {
                [field.name]: value,
              });
            }
            // Initialize property to display the kendo button used to open the grid cell content in a modal
            Object.assign(this.showFullScreenButtonObj.showFullScreenButton, {
              [field.name]: false,
            });
          } else {
            // Format files name and icons for each field
            (get(rowData, field.name) || {}).forEach(
              (file: { name: string }) => {
                const text = this.htmlParserService.applyLayoutFormat(
                  removeFileExtension(file.name),
                  field
                );
                Object.assign(this.textObj.text, {
                  [field.name]: {
                    [file.name]: text,
                  },
                });
                const icon = 'k-icon ' + getFileIcon(file.name);
                Object.assign(this.iconObj.icon, {
                  [file.name]: icon,
                });
              }
            );
          }
        }
      });
  }

  /**
   * Get the field text from the given row data object for the given field
   *
   * @param rowData grid row data object
   * @param {GridField} field field from which take and format data from the given row
   * @param {GridField} parent parent field
   * @returns {string} formatted by field type text content
   */
  private getFieldText(rowData: any, field: GridField, parent?: GridField) {
    let finalText: any = '';
    switch (field.meta.type) {
      case 'time':
        finalText = this.htmlParserService.applyLayoutFormat(
          this.datePipe.transform(
            getPropertyValue(rowData, field),
            'shortTime'
          ),
          field
        );
        break;
      case 'datetime':
      case 'datetime-local':
        finalText = this.htmlParserService.applyLayoutFormat(
          this.datePipe.transform(getPropertyValue(rowData, field), 'short'),
          field
        );
        break;
      case 'date':
        finalText = this.htmlParserService.applyLayoutFormat(
          this.datePipe.transform(
            getPropertyValue(rowData, field),
            'shortDate'
          ),
          field
        );
        break;
      case 'people-dropdown': {
        // People dropdown: { userid, firstname, lastname, emailaddress }
        const personData = getPropertyValue(rowData, field, parent);
        if (personData && typeof personData === 'object') {
          const firstName = personData.firstname || '';
          const lastName = personData.lastname || '';
          const email = personData.emailaddress || '';
          const name = [firstName, lastName].filter(Boolean).join(' ').trim();
          const displayValue = email
            ? name
              ? `${name} (${email})`
              : email
            : name || personData.userid || '';
          finalText = this.htmlParserService.applyLayoutFormat(
            displayValue,
            field
          );
        }
        break;
      }
      case 'people-tagbox': {
        // People tagbox: array of { userid, firstname, lastname, emailaddress }
        const peopleData = getPropertyValue(rowData, field, parent);
        if (Array.isArray(peopleData) && peopleData.length > 0) {
          const displayValues = peopleData.map((person: any) => {
            const firstName = person.firstname || '';
            const lastName = person.lastname || '';
            const email = person.emailaddress || '';
            const name = [firstName, lastName].filter(Boolean).join(' ').trim();
            return email
              ? name
                ? `${name} (${email})`
                : email
              : name || person.userid || '';
          });
          finalText = this.htmlParserService.applyLayoutFormat(
            displayValues.join(', '),
            field
          );
        }
        break;
      }
      default: {
        finalText = this.htmlParserService.applyLayoutFormat(
          getPropertyValue(rowData, field, parent),
          field
        );
      }
    }
    return finalText ?? '';
  }
}
