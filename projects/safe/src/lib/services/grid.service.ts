import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { prettifyLabel } from '../utils/prettify';
import get from 'lodash/get';
import { SafeApiProxyService } from './api-proxy.service';

/** List of multi select question types */
const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox', 'owner'];
/** List of disabled fields */
const DISABLED_FIELDS = [
  'id',
  'incrementalId',
  'createdAt',
  'modifiedAt',
  'form',
];
/** Transforms a list with nested lists into a flat list */
const flatDeep = (arr: any[]): any[] =>
  arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val),
    []
  );

/**
 * Shared grid service for the dashboards.
 * Exposes the available tiles, and find the settings from a widget.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeGridService {
  /**
   * Shared grid service for the dashboards.
   * Exposes the available tiles, and find the settings from a widget.
   *
   * @param formBuilder Angular form builder
   * @param apiProxyService Shared API proxy service
   */
  constructor(
    private formBuilder: FormBuilder,
    private apiProxyService: SafeApiProxyService
  ) {}

  /**
   * Generates list of fields for the grid, based on grid parameters.
   *
   * @param fields list of fields saved in settings.
   * @param prefix prefix of the field.
   * @param disabled disabled status of the field, can overwrite the meta one.
   * @param options additional options ( disable / filter )
   * @returns List of fields for the grid.
   */
  public getFields(
    fields: any[],
    metaFields: any,
    layoutFields: any,
    prefix?: string,
    options: { disabled?: boolean; hidden?: boolean; filter: boolean } = {
      disabled: false,
      hidden: false,
      filter: true,
    }
  ): any[] {
    return flatDeep(
      fields.map((f) => {
        const fullName: string = prefix ? `${prefix}.${f.name}` : f.name;
        switch (f.kind) {
          case 'OBJECT': {
            return this.getFields(
              f.fields,
              metaFields,
              layoutFields,
              fullName,
              {
                disabled: true,
                hidden: options.hidden,
                filter: prefix ? false : options.filter,
              }
            );
          }
          case 'LIST': {
            let metaData = get(metaFields, fullName);
            metaData = Object.assign([], metaData);
            metaData.type = 'records';
            const cachedField = get(layoutFields, fullName);
            const title = f.label ? f.label : prettifyLabel(f.name);
            const subFields = this.getFields(
              f.fields,
              metaFields,
              layoutFields,
              fullName,
              { disabled: true, hidden: true, filter: false }
            );
            return {
              name: fullName,
              title,
              type: f.type,
              format: this.getFieldFormat(f.type),
              editor: this.getFieldEditor(f.type),
              filter: prefix ? '' : this.getFieldFilter(f.type),
              meta: metaData,
              disabled: true,
              hidden: options.hidden || cachedField?.hidden || false,
              width: cachedField?.width || title.length * 7 + 50,
              order: cachedField?.order,
              query: {
                sort: f.sort,
                fields: f.fields,
                filter: f.filter,
              },
              subFields,
            };
          }
          default: {
            const metaData = get(metaFields, fullName);
            const cachedField = get(layoutFields, fullName);
            const title = f.label ? f.label : prettifyLabel(f.name);
            return {
              name: fullName,
              title,
              type: f.type,
              format: this.getFieldFormat(f.type),
              editor: this.getFieldEditor(f.type),
              filter: !options.filter ? '' : this.getFieldFilter(f.type),
              meta: metaData,
              disabled:
                options.disabled ||
                DISABLED_FIELDS.includes(f.name) ||
                metaData?.readOnly,
              hidden: options.hidden || cachedField?.hidden || false,
              width: cachedField?.width || title.length * 7 + 50,
              order: cachedField?.order,
            };
          }
        }
      })
    ).sort((a, b) => a.order - b.order);
  }

  /**
   * Gets editor of a field from its type.
   *
   * @param type Field type.
   * @returns name of the editor.
   */
  private getFieldEditor(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Float': {
        return 'float';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'datetime';
      }
      case 'Time': {
        return 'time';
      }
      case 'JSON': {
        return '';
      }
      default: {
        return 'text';
      }
    }
  }

  /**
   * Gets format of a field from its type ( only for date fields ).
   *
   * @param type Type of the field.
   * @returns Format of the field.
   */
  private getFieldFormat(type: any): string {
    switch (type) {
      case 'Date':
        return 'dd/MM/yy';
      case 'DateTime':
        return 'dd/MM/yy HH:mm';
      case 'Time':
        return 'HH:mm';
      default:
        return '';
    }
  }

  /**
   * Gets filter type of a field from its type.
   *
   * @param type Type of the field.
   * @returns Name of the field filter.
   */
  private getFieldFilter(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'date';
      }
      case 'Time': {
        return 'date';
      }
      case 'JSON': {
        return '';
      }
      default: {
        return 'text';
      }
    }
  }

  /**
   * Fetches choices from URL for fields with url parameter.
   */
  public async populateMetaFields(metaFields: any): Promise<void> {
    for (const fieldName of Object.keys(metaFields)) {
      const meta = metaFields[fieldName];
      if (meta.choicesByUrl) {
        const url: string = meta.choicesByUrl.url;
        const localRes = localStorage.getItem(url);
        if (localRes) {
          metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(
              JSON.parse(localRes),
              meta.choicesByUrl
            ),
          };
        } else {
          const res: any =
            await this.apiProxyService.promisedRequestWithHeaders(url);
          localStorage.setItem(url, JSON.stringify(res));
          metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(res, meta.choicesByUrl),
          };
        }
      }
    }
  }

  /**
   * Extracts choices using choicesByUrl properties
   *
   * @param res Result of http request.
   * @param choicesByUrl Choices By Url property.
   * @returns list of choices.
   */
  private extractChoices(
    res: any,
    choicesByUrl: {
      path?: string;
      value?: string;
      text?: string;
      hasOther?: boolean;
      otherText?: string;
    }
  ): { value: string; text: string }[] {
    let choices = choicesByUrl.path ? [...res[choicesByUrl.path]] : [...res];
    choices = choices
      ? choices.map((x: any) => ({
          value: (choicesByUrl.value ? x[choicesByUrl.value] : x).toString(),
          text: choicesByUrl.text
            ? x[choicesByUrl.text]
            : choicesByUrl.value
            ? x[choicesByUrl.value]
            : x,
        }))
      : [];
    if (choicesByUrl.hasOther) {
      choices.push({
        value: 'other',
        text: choicesByUrl.otherText ? choicesByUrl.otherText : 'Other',
      });
    }
    return choices;
  }

  /**
   * Creates form group for inline edition.
   *
   * @param dataItem Data item to open in inline edition.
   * @param fields List of grid fields.
   * @returns Form group of the item.
   */
  public createFormGroup(dataItem: any, fields: any[]): FormGroup {
    const formGroup: any = {};
    fields
      .filter((x) => !x.disabled)
      .forEach((field, index) => {
        if (
          field.type !== 'JSON' ||
          MULTISELECT_TYPES.includes(field.meta.type)
        ) {
          formGroup[field.name] = [dataItem[field.name]];
        } else {
          if (field.meta.type === 'multipletext') {
            const fieldGroup: any = {};
            for (const item of field.meta.items) {
              fieldGroup[item.name] = [
                dataItem[field.name] ? dataItem[field.name][item.name] : null,
              ];
            }
            formGroup[field.name] = this.formBuilder.group(fieldGroup);
          }
          if (field.meta.type === 'matrix') {
            const fieldGroup: any = {};
            for (const row of field.meta.rows) {
              fieldGroup[row.name] = [
                dataItem[field.name] ? dataItem[field.name][row.name] : null,
              ];
            }
            formGroup[field.name] = this.formBuilder.group(fieldGroup);
          }
          if (field.meta.type === 'matrixdropdown') {
            const fieldGroup: any = {};
            const fieldValue = dataItem[field.name];
            for (const row of field.meta.rows) {
              const rowValue = fieldValue ? fieldValue[row.name] : null;
              const rowGroup: any = {};
              for (const column of field.meta.columns) {
                const columnValue = rowValue ? rowValue[column.name] : null;
                rowGroup[column.name] = [columnValue];
              }
              fieldGroup[row.name] = this.formBuilder.group(rowGroup);
            }
            formGroup[field.name] = this.formBuilder.group(fieldGroup);
          }
          if (field.meta.type === 'matrixdynamic') {
            const fieldArray: any = [];
            const fieldValue = dataItem[field.name] ? dataItem[field.name] : [];
            for (const rowValue of fieldValue) {
              const rowGroup: any = {};
              for (const column of field.meta.columns) {
                const columnValue = rowValue ? rowValue[column.name] : null;
                if (MULTISELECT_TYPES.includes(column.cellType)) {
                  rowGroup[column.name] = [columnValue];
                } else {
                  rowGroup[column.name] = columnValue;
                }
              }
              fieldArray.push(this.formBuilder.group(rowGroup));
            }
            formGroup[field.name] = this.formBuilder.array(fieldArray);
          }
        }
      });
    return this.formBuilder.group(formGroup);
  }
}
