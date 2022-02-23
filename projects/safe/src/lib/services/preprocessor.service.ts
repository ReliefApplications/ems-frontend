import { Injectable } from '@angular/core';
import { QueryBuilderService } from './query-builder.service';
import { Apollo } from 'apollo-angular';
import { map, take } from 'rxjs/operators';
import get from 'lodash/get';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable({
  providedIn: 'root'
})
export class SafePreprocessorService {

  constructor(
    private queryBuilder: QueryBuilderService,
    private apollo: Apollo,
  ) { }

  /**
   * Preprocess text to replace keyword with corresponding data
   * @param text text to preprocess.
   * @param dataset optional dataset settings.
   * @returns preprocessed string.
   */
  public async preprocess(text: string, dataset: {
    settings: any,
    ids: string[],
    sortField?: string,
    sortOrder?: string
  } | null = null): Promise<string> {
    const promises: Promise<any>[] = [];

    // === TODAY ===
    if (text.includes('{today}')) {
      const todayToString = (new Date()).toDateString();
      text = text.split('{today}').join(todayToString);
    }

    // === DATASET ===
    if (text.includes('{dataset}') && dataset) {
      if (dataset.ids.length > 0) {
        const builtQuery = this.queryBuilder.buildQuery(dataset.settings);
        if (builtQuery) {
          const dataQuery = this.apollo.query<any>({
            query: builtQuery,
            variables: {
              first: dataset.ids.length,
              sortField: dataset.sortField ?? null,
              sortOrder: dataset.sortOrder || '',
              filter: {
                logic: 'and',
                filters: [
                  {
                    operator: 'eq',
                    field: 'ids',
                    value: dataset.ids
                  }
                ]
              },
              display: true
            }
          });
          promises.push(dataQuery.pipe(
            map((res: any) => {
              const fields = dataset.settings.query.fields;
              let items: any = [];
              for (const field in res.data) {
                if (Object.prototype.hasOwnProperty.call(res.data, field)) {
                  const nodes = res.data[field].edges.map((x: any) => x.node) || [];
                  items = cloneData(nodes);
                  this.convertDateFields(fields, items);
                }
              }
              const datasetToString = this.datasetToString(items, fields);
              text = text.split('{dataset}').join(datasetToString);
              return;
            }),
            take(1)
          ).toPromise());
        }
      } else {
        text = text.split('{dataset}').join('');
      }
    }

    await Promise.all(promises);
    return text;
  }

  /**
   * Builds the body of the email to open.
   * @param items list of items to stringify
   * @param fields fields to use for query.
   * @returns body of the email.
   */
   private datasetToString(items: any[], fields: any): string {
    let body = '';
    body += `--------------------------------------------------------------------------------------------------------------------------------\n`;
    for (const item of items) {
      body += this.datasetRowToString(item, fields);
      body += '--------------------------------------------------------------------------------------------------------------------------------\n';
    }
    return body;
  }

  /**
   * Builds a row of the email to open.
   * @param item item to stringify.
   * @param fields fields to use for query.
   * @param tabs string indentation.
   * @returns body of the email.
   */
  private datasetRowToString(item: any, fields: any, tabs = ''): string {
    let body = '';
    for (const field of fields) {
      switch (field.kind) {
        case 'LIST':
          body += `${tabs}${field.label ? field.label : field.name}:\n`;
          const list = item ? item[field.name] || [] : [];
          list.forEach((element: any, index: number) => {
            body += this.datasetRowToString(element, field.fields, tabs + '\t');
            if (index < (list.length - 1)) {
              body += `${tabs + '\t'}-----------------------\n`;
            }
          });
          break;
        case 'OBJECT':
          body += `${tabs}${field.label ? field.label : field.name}:\n`;
          body += this.datasetRowToString(item ? item[field.name] : null, field.fields, tabs + '\t');
          break;
        default:
          const value = get(item, field.name, '') || '';
          if (value) {
            body += `${tabs}${field.label ? field.label : field.title ? field.title : field.name}:\t${value}\n`;
          }
      }
    }
    return body;
  }

  /**
   * Transforms stored dates into readable dates.
   * @param fields list of fields.
   * @param items list of items.
   */
  private convertDateFields(fields: any[], items: any[]): void {
    const dateFields = fields.filter(x => ['Date', 'DateTime', 'Time'].includes(x.type)).map(x => x.name);
    items.map(x => {
      for (const [key, value] of Object.entries(x)) {
        if (dateFields.includes(key)) {
          x[key] = x[key] && new Date(x[key]);
        }
      }
    });
  }
}

