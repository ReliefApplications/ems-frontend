import { Injectable } from '@angular/core';
import { prettifyLabel } from '../../utils/prettify';
import get from 'lodash/get';
import { ApiProxyService } from '../api-proxy/api-proxy.service';
import { MULTISELECT_TYPES } from '../../components/ui/core-grid/grid/grid.constants';
import { TranslateService } from '@ngx-translate/core';
import { REFERENCE_DATA_END } from '../query-builder/query-builder.service';
import { isNil } from 'lodash';
import {
  getListOfKeys,
  getWithExpiry,
  setWithExpiry,
} from '../../utils/cache-with-expiry';
import { FormBuilder } from '@angular/forms';
import { flatDeep } from '../../utils/array-filter';
import { Apollo } from 'apollo-angular';
import { ResourceQueryResponse } from '../../models/resource.model';
import { GET_RESOURCE_FIELDS } from './graphql/queries';
import { map } from 'rxjs';

/** List of disabled fields */
const DISABLED_FIELDS = [
  'id',
  'incrementalId',
  'createdAt',
  'modifiedAt',
  'form',
  'lastUpdateForm',
];

/**
 * Shared grid service for the dashboards.
 * Exposes the available widgets, and find the settings from a widget.
 */
@Injectable({
  providedIn: 'root',
})
export class GridService {
  /**
   * Shared grid service for the dashboards.
   * Exposes the available wigets, and find the settings from a widget.
   *
   * @param fb Angular form builder
   * @param apiProxyService Shared API proxy service
   * @param translate Translate service
   * @param apollo Apollo service
   */
  constructor(
    private fb: FormBuilder,
    private apiProxyService: ApiProxyService,
    private translate: TranslateService,
    private apollo: Apollo
  ) {}

  /**
   * Generates list of fields for the grid, based on grid parameters.
   *
   * @param fields list of fields saved in settings.
   * @param metaFields list of metaFields (createdBy, updateBy...)
   * @param layoutFields list of layout fields
   * @param prefix prefix of the field.
   * @param options additional options ( disable / hidden / filter )
   * @param options.disabled disable the grid
   * @param options.hidden hide the grid
   * @param options.filter filter options for the grid
   * @returns The list of fields formatted for a grid component
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
        let metaData = get(metaFields, fullName);
        const canSee = get(metaData, 'permissions.canSee', true);
        const canUpdate = get(metaData, 'permissions.canUpdate', false);
        const hidden: boolean =
          (!isNil(canSee) && !canSee) || options.hidden || false;
        const disabled: boolean = options.disabled || !canUpdate;

        switch (f.kind) {
          case 'OBJECT': {
            if (f.type.endsWith(REFERENCE_DATA_END)) {
              metaData = Object.assign([], metaData);
              metaData.type = 'referenceData';
              const cachedField = get(layoutFields, fullName);
              const title = f.label ? f.label : prettifyLabel(f.name);
              const subFields = this.getFields(
                f.fields,
                metaFields,
                layoutFields,
                fullName,
                {
                  ...(!f.type.endsWith(REFERENCE_DATA_END) && {
                    disabled: true,
                  }),
                  hidden: !f.type.endsWith(REFERENCE_DATA_END),
                  filter: false,
                }
              );
              return {
                name: fullName,
                title,
                type: f.type,
                format: this.getFieldFormat(f.type),
                editor: this.getFieldFilterOrEditor(f.type),
                filter: prefix ? '' : this.getFieldFilterOrEditor(f.type),
                meta: metaData,
                disabled: f.type.endsWith(REFERENCE_DATA_END) ? false : true,
                hidden: hidden || cachedField?.hidden || false,
                width: cachedField?.width || title.length * 7 + 50,
                order: cachedField?.order,
                query: {
                  sort: f.sort,
                  fields: f.fields,
                  filter: f.filter,
                },
                subFields,
                canSee: true,
              };
            } else {
              return this.getFields(
                f.fields,
                metaFields,
                layoutFields,
                fullName,
                {
                  disabled: true,
                  hidden,
                  filter: prefix ? false : options.filter,
                }
              );
            }
          }
          case 'LIST': {
            metaData = Object.assign([], metaData);
            if (f.type.endsWith(REFERENCE_DATA_END)) {
              metaData.type = 'referenceData';
            } else {
              metaData.type = 'records';
            }
            const cachedField = get(layoutFields, fullName);
            const title = f.label ? f.label : prettifyLabel(f.name);
            const subFields = this.getFields(
              f.fields,
              metaFields,
              layoutFields,
              fullName,
              {
                ...(!f.type.endsWith(REFERENCE_DATA_END) && { disabled: true }),
                hidden: !f.type.endsWith(REFERENCE_DATA_END),
                filter: false,
              }
            );
            return {
              name: fullName,
              title,
              type: f.type,
              format: this.getFieldFormat(f.type),
              editor: this.getFieldFilterOrEditor(f.type),
              filter: prefix ? '' : this.getFieldFilterOrEditor(f.type),
              meta: metaData,
              disabled: f.type.endsWith(REFERENCE_DATA_END) ? false : true,
              hidden: hidden || cachedField?.hidden || false,
              width: cachedField?.width || title.length * 7 + 50,
              order: cachedField?.order,
              query: {
                sort: f.sort,
                fields: f.fields,
                filter: f.filter,
              },
              subFields,
              canSee: true,
            };
          }
          default: {
            const cachedField = get(layoutFields, fullName);
            const title = f.label ? f.label : prettifyLabel(f.name);
            return {
              name: fullName,
              title,
              type: f.type,
              layoutFormat: f.format,
              format: this.getFieldFormat(f.type),
              editor: this.getFieldFilterOrEditor(f.type),
              filter: !options.filter
                ? ''
                : this.getFieldFilterOrEditor(f.type),
              meta: metaData ? metaData : { type: 'text' },
              disabled:
                disabled ||
                DISABLED_FIELDS.includes(f.name) ||
                get(metaData, 'readOnly', false) ||
                get(metaData, 'isCalculated', false),
              hidden: hidden || cachedField?.hidden || false,
              width: cachedField?.width || title.length * 7 + 50,
              order: cachedField?.order,
              canSee,
            };
          }
        }
      })
    )
      .filter((f) => f.canSee)
      .sort((a, b) => a.order - b.order);
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
   * Gets filter type of a field from its type or gets editor of a field from its type.
   *
   * @param type Type of the field.
   * @returns Name of the field filter.
   */
  private getFieldFilterOrEditor(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Float': {
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
   *
   * @param metaFields List of meta fields
   */
  public async populateMetaFields(metaFields: any): Promise<void> {
    const promises: Promise<any>[] = [];
    const cachedKeys = await getListOfKeys();
    /**
     * Fetches choices from URL, cache them and set meta.
     *
     * @param url URL to target.
     * @param fieldName Field name to update meta.
     * @param meta Meta to expand. Corresponding to fieldName.
     * @returns A promise to execute everything.
     */
    const fetchChoicesAndSetMeta = (
      url: string,
      fieldName: string,
      meta: any
    ): Promise<void> =>
      this.apiProxyService
        .promisedRequestWithHeaders(url)
        .then((value: any) => {
          const choices = this.extractChoices(value, meta.choicesByUrl);
          setWithExpiry(url, choices);
          metaFields[fieldName] = {
            ...meta,
            choices,
          };
        });

    for (const fieldName of Object.keys(metaFields)) {
      const meta = metaFields[fieldName];
      if (meta.choicesByUrl) {
        const url: string = meta.choicesByUrl.url;
        if (cachedKeys.includes(url)) {
          promises.push(
            getWithExpiry(url).then(
              (choices: { value: string; text: string }[] | null) => {
                if (choices === null) {
                  return fetchChoicesAndSetMeta(url, fieldName, meta);
                } else {
                  metaFields[fieldName] = {
                    ...meta,
                    choices,
                  };
                  return;
                }
              }
            )
          );
        } else {
          promises.push(fetchChoicesAndSetMeta(url, fieldName, meta));
        }
      }
      if (meta.choices) {
        metaFields[fieldName] = {
          ...meta,
          choices: meta.choices.map((choice: any) => ({
            value: choice.value,
            text:
              choice.text[this.translate.currentLang] ||
              choice.text.default ||
              choice.text,
          })),
        };
      }
    }
    await Promise.all(promises);
  }

  /**
   * Extracts choices using choicesByUrl properties
   *
   * @param res Result of http request.
   * @param choicesByUrl Choices By Url property.
   * @param choicesByUrl.path The path of the url to fetch
   * @param choicesByUrl.value The key for values in the response
   * @param choicesByUrl.text The key for labels in the response
   * @param choicesByUrl.hasOther If the "other" option is enabled
   * @param choicesByUrl.otherText Label fot the "other" option if enabled
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
      ? choices
          .map((x: any) => {
            const value = (
              choicesByUrl.value ? get(x, choicesByUrl.value) : x
            )?.toString();
            return {
              value,
              text: (choicesByUrl.text && get(x, choicesByUrl.text)) || value,
            };
          })
          .filter((x) => !isNil(x.text))
      : [];
    if (choicesByUrl.hasOther) {
      choices.push({
        value: 'other',
        text: choicesByUrl.otherText ? choicesByUrl.otherText : 'Other',
      });
    }
    choices.sort((a: any, b: any) => a.text.localeCompare(b.text));
    return choices;
  }

  /**
   * Creates form group for inline edition.
   *
   * @param dataItem Data item to open in inline edition.
   * @param fields List of grid fields.
   * @returns Form group of the item.
   */
  public createFormGroup(dataItem: any, fields: any[]) {
    const formGroup: any = {};
    const data = get(dataItem, '_meta.raw') || {};
    fields
      .filter((x) => !x.disabled)
      .forEach((field) => {
        if (
          field.type !== 'JSON' ||
          MULTISELECT_TYPES.includes(field.meta.type)
        ) {
          formGroup[field.name] = [data[field.name]];
        } else {
          if (field.meta.type === 'multipletext') {
            const fieldGroup: any = {};
            for (const item of field.meta.items) {
              fieldGroup[item.name] = [
                data[field.name] ? data[field.name][item.name] : null,
              ];
            }
            formGroup[field.name] = this.fb.group(fieldGroup);
          }
          if (field.meta.type === 'matrix') {
            const fieldGroup: any = {};
            for (const row of field.meta.rows) {
              fieldGroup[row.name] = [
                data[field.name] ? data[field.name][row.name] : null,
              ];
            }
            formGroup[field.name] = this.fb.group(fieldGroup);
          }
          if (field.meta.type === 'matrixdropdown') {
            const fieldGroup: any = {};
            const fieldValue = data[field.name];
            for (const row of field.meta.rows) {
              const rowValue = fieldValue ? fieldValue[row.name] : null;
              const rowGroup: any = {};
              for (const column of field.meta.columns) {
                const columnValue = rowValue ? rowValue[column.name] : null;
                rowGroup[column.name] = [columnValue];
              }
              fieldGroup[row.name] = this.fb.group(rowGroup);
            }
            formGroup[field.name] = this.fb.group(fieldGroup);
          }
          if (field.meta.type === 'matrixdynamic') {
            const fieldArray: any = [];
            const fieldValue = data[field.name] ? data[field.name] : [];
            for (const rowValue of fieldValue) {
              const rowGroup: any = {};
              for (const column of field.meta.columns) {
                const columnValue = rowValue ? rowValue[column.name] : null;
                if (MULTISELECT_TYPES.includes(column.type)) {
                  rowGroup[column.name] = [columnValue];
                } else {
                  rowGroup[column.name] = columnValue;
                }
              }
              fieldArray.push(this.fb.group(rowGroup));
            }
            formGroup[field.name] = this.fb.array(fieldArray);
          }
        }
      });
    return this.fb.group(formGroup);
  }

  /**
   * Get field definition from resource id and field name
   *
   * @param resourceId current resource id
   * @param fieldName current field name
   * @returns field definition
   */
  public getFieldDefinition(resourceId: string, fieldName: string) {
    return this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_FIELDS,
        variables: {
          id: resourceId,
        },
      })
      .pipe(
        map(({ data }) => {
          if (data.resource) {
            const field = data.resource.fields.find(
              (f: any) => f.name === fieldName
            );
            return field;
          }
        })
      );
  }
}
