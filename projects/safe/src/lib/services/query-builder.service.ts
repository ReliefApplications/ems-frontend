import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetQueryTypes, GET_QUERY_TYPES } from '../graphql/queries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { prettifyLabel } from '../utils/prettify';
import { ApolloQueryResult } from '@apollo/client';

/** List of fields part of the schema but not selectable */
const NON_SELECTABLE_FIELDS = ['canUpdate', 'canDelete'];
/** List of user fields */
const USER_FIELDS = ['id', 'name', 'username'];

/**
 * Shared query builder service. The query builder service is used by the widgets, that creates the query based on their settings.
 * Query builder service only performs query on the schema generated on the go from the forms / resources definitions.
 */
@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  /** Available forms / resources queries */
  private availableQueries = new BehaviorSubject<any[]>([]);
  /** Available forms / resources queries as observalbe */
  get availableQueries$(): Observable<any> {
    return this.availableQueries.asObservable();
  }
  /** Available forms / resources types */
  private availableTypes = new BehaviorSubject<any[]>([]);
  /** Available forms / resources types as observable */
  get availableTypes$(): Observable<any> {
    return this.availableTypes.asObservable();
  }
  /** User fields */
  private userFields = [];

  /**
   * Shared query builder service. The query builder service is used by the widgets, that creates the query based on their settings.
   * Query builder service only performs query on the schema generated on the go from the forms / resources definitions.
   *
   * @param apollo Apollo client
   * @param formBuilder Angular form builder
   */
  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder
  ) {
    this.apollo.query<GetQueryTypes>({
      query: GET_QUERY_TYPES,
    }).subscribe((res) => {
      // eslint-disable-next-line no-underscore-dangle
      this.availableQueries.next(res.data.__schema.queryType.fields.filter((x: any) => x.name.startsWith('all')));
      // eslint-disable-next-line no-underscore-dangle
      this.availableTypes.next(res.data.__schema.types);
      // eslint-disable-next-line no-underscore-dangle
      this.userFields = res.data.__schema.types.find((x: any) => x.name === 'User').fields.filter((x: any) => USER_FIELDS.includes(x.name));
    });
  }

  /**
   * Gets list of fields from a query name.
   *
   * @param queryName Form / Resource query name.
   * @returns List of fields of this structure.
   */
  public getFields(queryName: string): any[] {
    const query = this.availableQueries.getValue().find(x => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes.getValue().find(x => x.name === typeName);
    return type ? type.fields.filter((x: any) => !NON_SELECTABLE_FIELDS.includes(x.name))
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];
  }

  /**
   * Gets list of fields from a type.
   *
   * @param typeName Form / Resource type.
   * @returns List of fields of this structure.
   */
  public getFieldsFromType(typeName: string): any[] {
    if (typeName === 'User') {
      return this.userFields;
    }
    const type = this.availableTypes.getValue().find(x => x.name === typeName);
    return type ? type.fields.filter((x: any) => !NON_SELECTABLE_FIELDS.includes(x.name))
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];
  }

  /**
   * Gets list of LIST fields from a query name.
   *
   * @param queryName Form / Resource query name.
   * @returns List of LIST fields of this structure.
   */
  public getListFields(queryName: string): any[] {
    const query = this.availableQueries.getValue().find(x => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes.getValue().find(x => x.name === typeName);
    return type ? type.fields.filter((x: any) => x.type.kind === 'LIST')
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];
  }

  /**
   * Builds the fields part of the GraphQL query.
   *
   * @param fields List of fields to query.
   * @returns QL document to build the query.
   */
  private buildFields(fields: any[]): any {
    return ['id\n'].concat(fields.map(x => {
      switch (x.kind) {
        case 'SCALAR': {
          return x.name + '\n';
        }
        case 'LIST': {
          return `${x.name} (
            sortField: ${x.sort.field ? `"${x.sort.field}"` : null},
            sortOrder: "${x.sort.order}",
            filter: ${this.filterToString(x.filter)}
          ) {
            ${['canUpdate\ncanDelete\n'].concat(this.buildFields(x.fields))}
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

  /**
   * Builds parsable GraphQL string from the filter definition.
   *
   * @param filter Filter definition
   * @returns GraphQL parsable strinf for the filter.
   */
  private filterToString(filter: any): string {
    if (filter.filters) {
      return `{ logic: "${filter.logic}", filters: [${filter.filters.map((x: any) => this.filterToString(x))}]}`;
    } else {
      return `{ field: "${filter.field}", operator: "${filter.operator}", value: "${filter.value}" }`;
    }
  }

  /**
   * Builds the fields part of the GraphQL meta query.
   *
   * @param fields List of fields to query.
   * @returns QL document to build the query.
   */
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

  /**
   * Builds a form / resource query from widget settings.
   * TODO: we should pass directly the query definition, instead of the settings.
   *
   * @param settings Widget settings.
   * @returns GraphQL query.
   */
  public buildQuery(settings: any): any {
    const builtQuery = settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const fields = ['canUpdate\ncanDelete\n'].concat(this.buildFields(builtQuery.fields));
      const query = gql`
        query GetCustomQuery($first: Int, $skip: Int, $filter: JSON, $sortField: String, $sortOrder: String) {
          ${builtQuery.name}(
          first: $first,
          skip: $skip,
          sortField: $sortField,
          sortOrder: $sortOrder,
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

  /**
   * Builds a GraphQL meta query of a form / resource from widget settings.
   *
   * @param settings Widget settings.
   * @returns GraphQL meta query.
   */
  public buildMetaQuery(settings: any): Observable<ApolloQueryResult<any>> | null {
    const builtQuery = settings.query;
    if (builtQuery && builtQuery.fields.length > 0) {
      const metaFields = this.buildMetaFields(builtQuery.fields);
      const query = gql`
        query GetCustomMetaQuery {
          _${builtQuery.name}Meta {
            ${metaFields}
          }
        }
      `;
      return this.apollo.query<any>({
        query,
        variables: {},
        fetchPolicy: 'cache-first'
      });
    } else {
      return null;
    }
  }

  /**
   * Returns the query name from a resource name.
   *
   * @param resourceName Resource name
   * @returns Query name
   */
  public getQueryNameFromResourceName(resourceName: string): any {
    const nameTrimmed = resourceName.replace(/\s/g, '').toLowerCase();
    return this.availableQueries.getValue().find(x => x.type.name.toLowerCase() === nameTrimmed + 'connection')?.name || '';
  }

  /**
   * Builds a query form.
   *
   * @param value Initial value
   * @param validators Enables or not the validators of the form
   * @returns Query form
   */
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

  /**
   * Builds a filter form
   *
   * @param filter Initial filter
   * @param fields List of fields
   * @returns Filter form
   */
  public createFilterGroup(filter: any, fields: any): FormGroup {
    if (filter) {
      if (filter.filters) {
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
            value: Array.isArray(filter.value) ? [filter.value] : filter.value
          });
        }
      }
    }
    return this.formBuilder.group({
      logic: 'and',
      filters: this.formBuilder.array([])
    });
  }

  /**
   * Adds a field to the query
   *
   * @param field Field definition
   * @param newField Is the field new ?
   * @returns Field form
   */
  public addNewField(field: any, newField?: boolean): FormGroup {
    switch (newField ? field.type.kind : field.kind) {
      case 'LIST': {
        return this.formBuilder.group({
          name: [{ value: field.name, disabled: true }],
          label: [field.label],
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

  /**
   * Finds the source of a query.
   * Used in order to find related forms.
   *
   * @param queryName Query name
   * @returns Apollo query.
   */
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
