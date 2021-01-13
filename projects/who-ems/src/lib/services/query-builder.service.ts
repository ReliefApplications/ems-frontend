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
    return query ? query.type.ofType.fields : [];
  }

  public getFieldsFromType(typeName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.type.ofType.name === typeName);
    return query ? query.type.ofType.fields : [];
  }

  public getListFields(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.type.ofType.fields.filter(x => x.type.kind === 'LIST') : [];
  }

  public getFilter(queryName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.name === queryName);
    return query ? query.args.find(x => x.name === 'filter').type.inputFields : [];
  }

  public getFilterFromType(typeName: string): any[] {
    const query = this.__availableQueries.getValue().find(x => x.type.ofType.name === typeName);
    return query ? query.args.find(x => x.name === 'filter').type.inputFields : [];
  }

  private buildFilter(filter: any): any {
    return filter ? Object.keys(filter).reduce((o, key) => {
      if (filter[key] || filter[key] === false) {
        return { ...o, [key]: filter[key] };
      }
      return { ...o };
    }, {}) : null;
  }

  private buildFields(fields: any[]): any {
    return ['id\n'].concat(fields.map(x => {
      switch (x.kind) {
        case 'SCALAR': {
          return x.name + '\n';
        }
        case 'LIST': {
          return `${x.name}(
            sortField: ${x.sort.field ? `"${x.sort.field}"` : null},
            sortOrder: "${x.sort.order}",
            filter: ${this.objToString(this.buildFilter(x.filter))}
          ) {
            ${this.buildFields(x.fields)}
          }` + '\n';
        }
        case 'OBJECT': {
          return `${x.name} {
            ${this.buildFields(x.fields)}
          }` + '\n';
        }
        default: {
          return;
        }
      }
    }));
  }

  public buildQuery(settings: any): any {
    const builtQuery = settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const fields = this.buildFields(builtQuery.fields);
      const query = gql`
        query GetCustomQuery {
          ${builtQuery.name}(
            sortField: ${builtQuery.sort.field ? `"${builtQuery.sort.field}"` : null},
            sortOrder: "${builtQuery.sort.order}",
            filter: ${this.objToString(this.buildFilter(builtQuery.filter))}
          ) {
            ${fields}
          }
        }
      `;
      return this.apollo.watchQuery<any>({
        query,
        variables: {}
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
