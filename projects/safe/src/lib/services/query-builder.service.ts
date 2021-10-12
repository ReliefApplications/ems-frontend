import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetQueryTypes, GET_QUERY_TYPES } from '../graphql/queries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { prettifyLabel } from '../utils/prettify';

const DEFAULT_FIELDS = ['id', 'createdAt', 'createdBy', 'lastUpdatedBy', 'modifiedAt', 'canUpdate', 'canDelete'];
const DISABLED_FIELDS = ['canUpdate', 'canDelete'];
const USER_FIELDS = ['id', 'name', 'username'];

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  private availableQueries = new BehaviorSubject<any[]>([]);
  private availableTypes = new BehaviorSubject<any[]>([]);
  private userFields = [];

  get availableQueries$(): Observable<any> {
    return this.availableQueries.asObservable();
  }

  get availableTypes$(): Observable<any> {
    return this.availableTypes.asObservable();
  }

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder
  ) {
    this.apollo.watchQuery<GetQueryTypes>({
      query: GET_QUERY_TYPES,
    }).valueChanges.subscribe((res) => {
      this.availableQueries.next(res.data.__schema.queryType.fields.filter((x: any) => x.name.startsWith('all')));
      this.availableTypes.next(res.data.__schema.types);
      this.userFields = res.data.__schema.types.find((x: any) => x.name === 'User').fields.filter((x: any) => USER_FIELDS.includes(x.name));
    });
  }

  public getFields(queryName: string): any[] {
    const query = this.availableQueries.getValue().find(x => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes.getValue().find(x => x.name === typeName);
    return type ? type.fields.filter((x: any) => !DISABLED_FIELDS.includes(x.name))
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];
  }

  public getFieldsFromType(typeName: string): any[] {
    if (typeName === 'User') {
      return this.userFields;
    }
    const type = this.availableTypes.getValue().find(x => x.name === typeName);
    return type ? type.fields.filter((x: any) => !DISABLED_FIELDS.includes(x.name))
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];
  }

  public getListFields(queryName: string): any[] {
    const query = this.availableQueries.getValue().find(x => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes.getValue().find(x => x.name === typeName);
    return type ? type.fields.filter((x: any) => x.type.kind === 'LIST')
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];
  }

  private buildFilter(filter: any): any {
    return filter ? Object.keys(filter).reduce((o, key) => {
      if (filter[key] || filter[key] === false) {
        if (filter[key] === 'today()') {
          return { ...o, [key]: new Date().toISOString().substring(0, 10) };
        }
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
          return '';
        }
      }
    }));
  }

  private buildMetaFields(fields: any[]): any {
    if (!fields) {
      return '';
    }
    return [''].concat(fields.map(x => {
      switch (x.kind) {
        case 'SCALAR': {
          return x.name + '\n';
        }
        case 'LIST': {
          return `${x.name} {
            ${x.fields && x.fields.length > 0 ? this.buildMetaFields(x.fields) : ''}
          }` + '\n';
        }
        case 'OBJECT': {
          return `${x.name} {
            ${x.fields && x.fields.length > 0 ? this.buildMetaFields(x.fields) : ''}
          }` + '\n';
        }
        default: {
          return '';
        }
      }
    }));
  }

  public buildQuery(settings: any): any {
    const builtQuery = settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const fields = ['canUpdate\ncanDelete\n'].concat(this.buildFields(builtQuery.fields));
      // filter: ${this.objToString(this.buildFilter(builtQuery.filter))}
      const query = gql`
        query GetCustomQuery($first: Int, $skip: Int, $filter: JSON) {
          ${builtQuery.name}(
          first: $first,
          skip: $skip,
          sortField: ${builtQuery.sort && builtQuery.sort.field ? `"${builtQuery.sort.field}"` : null},
          sortOrder: "${builtQuery.sort?.order || '' }",
          filter: $filter
          ) {
            edges {
              node {
                ${fields}
              }
            }
            totalCount
        }
        }
      `;
      return query;
    } else {
      return null;
    }
  }

  public buildMetaQuery(settings: any, subQuery = false): any {
    const builtQuery = subQuery ? settings : settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const metaFields = this.buildMetaFields(builtQuery.fields);
      const query = gql`
        query GetCustomMetaQuery {
          _${subQuery ? builtQuery.type : builtQuery.name}Meta {
            ${metaFields}
          }
        }
      `;
      return this.apollo.query<any>({
        query,
        variables: {}
      });
    } else {
      return null;
    }
  }

  public getMetaFields(queryName: string, fields: any): any {
    const metaFields = this.buildMetaFields(fields);
    const query = gql`
      query GetCustomMetaQuery {
        _${queryName}Meta {
          ${metaFields}
        }
      }
    `;
    this.apollo.query<any>({
      query
    });
  }

  public getQueryNameFromResourceName(resourceName: string): any {
    const nameTrimmed = resourceName.replace(/\s/g, '').toLowerCase();
    return this.availableQueries.getValue().find(x => x.type.name.toLowerCase() === nameTrimmed + 'connection')?.name || '';
  }

  private objToString(obj: any): string {
    let str = '{';
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str += p + ': ' + (
            typeof obj[p] === 'string' ? `"${obj[p]}"` :
            Array.isArray(obj[p]) ? this.arrayToString(obj[p]) :
            obj[p]
          ) + ',\n';
      }
    }
    return str + '}';
  }

  private arrayToString(array: any): string {
    let str = '[';
    for (const item of array) {
      str += (typeof item === 'string' ? `"${item}"` : item) + ',\n';
    }
    return str + ']';
  }

  public createQueryForm(value: any, validators = true): FormGroup {
    return this.formBuilder.group({
      name: [value ? value.name : '', validators ? Validators.required : null],
      template: [value ? value.template : '', null],
      fields: this.formBuilder.array((value && value.fields) ? value.fields.map((x: any) => this.addNewField(x)) : [],
       validators ? Validators.required : null),
      sort: this.formBuilder.group({
        field: [(value && value.sort) ? value.sort.field : ''],
        order: [(value && value.sort) ? value.sort.order : 'asc']
      }),
      filter: this.createFilterGroup(value && value.filter ? value.filter : {}, null)
    });
  }

  public createFilterGroup(filter: any, fields: any): FormGroup {
    if (filter.filter) {
      const filters = filter.filters.map((x: any) => this.createFilterGroup(x, fields));
      return this.formBuilder.group({
        logic: filter.logic || 'and',
        filters: this.formBuilder.array(filters)
      });
    } else {
      if (filter.field) {
        return this.formBuilder.group({
          field: filter.field,
          operator: filter.operator || 'eq',
          value: filter.value
        });
      } else {
        return this.formBuilder.group({
          logic: 'and',
          filters: this.formBuilder.array([])
        });
      }
    }
  }

  public addNewField(field: any, newField?: boolean): FormGroup {
    switch (newField ? field.type.kind : field.kind) {
      case 'LIST': {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          type: [newField ? field.type.ofType.name : field.type],
          kind: [newField ? field.type.kind : field.kind],
          fields: this.formBuilder.array((!newField && field.fields) ?
            field.fields.map((x: any) => this.addNewField(x)) : [], Validators.required),
          sort: this.formBuilder.group({
            field: [field.sort ? field.sort.field : ''],
            order: [(field.sort && field.sort.order) ? field.sort.order : 'asc']
          }),
          filter: newField ? this.formBuilder.group({}) : this.createFilterGroup(field.filter, null)
        });
      }
      case 'OBJECT': {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          type: [newField ? field.type.name : field.type],
          kind: [newField ? field.type.kind : field.kind],
          fields: this.formBuilder.array((!newField && field.fields) ?
            field.fields.map((x: any) => this.addNewField(x)) : [], Validators.required),
        });
      }
      default: {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          type: [{ value: newField ? field.type.name : field.type, disabled: true }],
          kind: [newField ? field.type.kind : field.kind],
          label: [field.label ? field.label : prettifyLabel(field.name), Validators.required]
        });
      }
    }
  }

  public sourceQuery(queryName: string): any {
    const queries = this.availableQueries.getValue().map(x => x.name);
    if (queries.includes(queryName)) {
      const query = gql`
        query GetCustomSourceQuery {
          _${queryName}Meta {
            _source
          }
        }
      `;
      return this.apollo.query<any>({
        query,
        variables: {}
      });
    } else {
      return null;
    }
  }
}
