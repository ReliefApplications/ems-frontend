import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetQueryTypes, GET_QUERY_TYPES } from '../graphql/queries';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  // tslint:disable-next-line: variable-name
  public __availableQueries = new BehaviorSubject<any[]>([]);

  get availableQueries(): Observable<any> {
    return this.__availableQueries.asObservable();
  }

  constructor(
    private apollo: Apollo
  ) {
    this.apollo.watchQuery<GetQueryTypes>({
      query: GET_QUERY_TYPES,
    }).valueChanges.subscribe((res) => {
      this.__availableQueries.next(res.data.__schema.queryType.fields.filter(x => x.name.startsWith('all')));
    });
  }


  public getFields(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.type.ofType.fields.filter(x => x.type.kind === 'SCALAR') : [];
  }

  public getFieldsFromType(typeName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.type.ofType.name === typeName);
    return query ? query.type.ofType.fields.filter(x => x.type.kind === 'SCALAR') : [];
  }

  public getListFields(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.type.ofType.fields.filter(x => x.type.kind === 'LIST') : [];
  }

  public getFilter(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.args.find(x => x.name === 'filter').type.inputFields : [];
  }

  public buildQuery(settings: any): any {
    const filter = settings.filter ? Object.keys(settings.filter).reduce((o, key) => {
      if (settings.filter[key]) {
        return { ...o, [key]: settings.filter[key] };
      }
      return { ...o };
    }, {}) : null;
    if (settings.queryType && settings.fields) {
      const fields = ['id\n'].concat(settings.fields.join('\n'));
      if (settings.details && settings.details.type && settings.details.fields.length > 0) {
        const detailsFields = ['id\n'].concat(settings.details.fields.join('\n'));
        fields.push(`${settings.details.type} { ${detailsFields} }`);
      }
      const query = gql`
        query GetCustomQuery($sortField: String, $sortOrder: String) {
          ${settings.queryType}(
            sortField: $sortField,
            sortOrder: $sortOrder,
            filter: ${this.objToString(filter)}
          ) {
            ${fields}
          }
        }
      `;
      return this.apollo.watchQuery<any>({
        query,
        variables: {
          sortField: settings.sortField,
          sortOrder: settings.sortOrder
        }
      });
    } else {
      return null;
    }
  }

  private objToString(obj): string {
    let str = '{';
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str += p + ': ' + (typeof obj[p] === 'string' ? `"${obj[p]}"` : obj[p]) + ',\n';
      }
    }
    return str + '}';
  }
}
