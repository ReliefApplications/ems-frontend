import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { GET_QUERY_META_DATA, GET_QUERY_TYPES } from './graphql/queries';
import { ApolloQueryResult } from '@apollo/client';
import get from 'lodash/get';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Connection } from '../../utils/public-api';
import {
  QueryMetaDataQueryResponse,
  QueryTypes,
} from '../../models/metadata.model';

/** Interface for the variables of a query */
interface QueryVariables {
  first?: number;
  skip?: number;
  filter?: any;
  sortField?: string;
  sortOrder?: string;
  display?: boolean;
  styles?: any;
  at?: Date;
}

/** Interface for a query response */
export interface QueryResponse {
  [key: string]: Connection<any>;
}

/** Field interface definition */
export interface Field {
  name: string;
  editor:
    | 'text'
    | 'boolean'
    | 'attribute'
    | 'select'
    | 'numeric'
    | 'datetime'
    | 'date'
    | 'time';
  label?: string;
  automated?: boolean;
  filter: any;
  fields?: Field[];
  options?: { value: any; text: string }[];
}

/** Stored query field interface definition */
export interface QueryField {
  name: string;
  kind: 'OBJECT' | 'SCALAR' | 'LIST';
  label?: string;
  type?: string;
  ofType?: any;
}

/** Query interface definition */
interface Query {
  name: string;
  fields: QueryField[];
  filter?: CompositeFilterDescriptor;
  sort?: {
    field?: string;
    order?: 'asc' | 'desc';
  };
  style?: any;
}

/** List of fields part of the schema but not selectable */
const NON_SELECTABLE_FIELDS = ['canUpdate', 'canDelete'];
/** List of fields part of the schema but not selectable */
const SELECTABLE_ID_FIELDS = ['id', 'incrementalId', 'form', 'lastUpdateForm'];
/** List of user fields */
const USER_FIELDS = ['id', 'name', 'username'];
/** ReferenceData identifier convention */
export const REFERENCE_DATA_END = 'Ref';

/**
 * Shared query builder service. The query builder service is used by the widgets, that creates the query based on their settings.
 * Query builder service only performs query on the schema generated on the go from the forms / resources definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class QueryBuilderService {
  /** Available forms / resources queries */
  private availableQueries = new BehaviorSubject<any[]>([]);

  /** @returns Available forms / resources queries as observable */
  get availableQueries$(): Observable<any> {
    return this.availableQueries.asObservable();
  }

  /** Available forms / resources types */
  private availableTypes = new BehaviorSubject<any[]>([]);

  /** @returns Available forms / resources types as observable */
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
   */
  constructor(private apollo: Apollo) {
    this.apollo
      .query<QueryTypes>({
        query: GET_QUERY_TYPES,
      })
      .subscribe(({ data }) => {
        // eslint-disable-next-line no-underscore-dangle
        this.availableTypes.next(data.__schema.types);
        this.availableQueries.next(
          // eslint-disable-next-line no-underscore-dangle
          data.__schema.queryType.fields.filter((x: any) =>
            x.name.startsWith('all')
          )
        );
        // eslint-disable-next-line no-underscore-dangle
        this.userFields = data.__schema.types
          .find((x: any) => x.name === 'User')
          .fields.filter((x: any) => USER_FIELDS.includes(x.name));
      });
  }

  /**
   * Gets list of fields from a type.
   *
   * @param type Corresponding type from availableTypes.
   * @returns List of fields of this type.
   */
  private extractFieldsFromType(type: any): {
    name: string;
    type: {
      fields: any[] | null;
      kind: 'SCALAR' | 'LIST' | 'OBJECT';
      name: string;
      ofType?: any;
    };
    args: any;
  }[] {
    const fields = type.fields
      .filter(
        (x: any) =>
          !NON_SELECTABLE_FIELDS.includes(x.name) &&
          (SELECTABLE_ID_FIELDS.includes(x.name) || x.type.name !== 'ID') &&
          (x.type.kind !== 'LIST' || x.type.ofType.name !== 'ID')
      )
      .map((x: any) => {
        if (x.type.kind === 'OBJECT') {
          return Object.assign({}, x, {
            type: Object.assign({}, x.type, {
              fields: x.type.fields.filter(
                (y: any) =>
                  y.type.kind === 'SCALAR' &&
                  !NON_SELECTABLE_FIELDS.includes(y.name) &&
                  (x.type.name !== 'User' || USER_FIELDS.includes(y.name))
              ),
            }),
          });
        }
        return x;
      })
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
    return fields;
  }

  /**
   * Gets list of fields from a query name.
   *
   * @param queryName Form / Resource query name.
   * @returns List of fields of this structure.
   */
  public getFields(queryName: string) {
    const query = this.availableQueries
      .getValue()
      .find((x) => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes
      .getValue()
      .find((x) => x.name === typeName);
    return type ? this.extractFieldsFromType(type) : [];
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
    const type = this.availableTypes
      .getValue()
      .find((x) => x.name === typeName);
    return type ? this.extractFieldsFromType(type) : [];
  }

  /**
   * Builds the fields part of the GraphQL query.
   *
   * @param fields List of fields to query.
   * @param withId Boolean to add a default ID field.
   * @returns QL document to build the query.
   */
  private buildFields(fields: any[], withId = true): string[] {
    const defaultField: string[] = withId ? ['id\n'] : [];
    return defaultField.concat(
      fields.map((x) => {
        switch (x.kind) {
          case 'SCALAR': {
            return x.name + '\n';
          }
          case 'LIST': {
            if (x.type.endsWith(REFERENCE_DATA_END)) {
              return (
                `${x.name} {
              ${this.buildFields(x.fields, false)}
            }` + '\n'
              );
            }
            return (
              `${x.name} (
            sortField: ${x.sort.field ? `"${x.sort.field}"` : null},
            sortOrder: "${x.sort.order}",
            first: ${get(x, 'first', null)},
            filter: ${this.filterToString(x.filter)}
          ) {
            ${['canUpdate\ncanDelete\n'].concat(this.buildFields(x.fields))}
          }` + '\n'
            );
          }
          case 'OBJECT': {
            return (
              `${x.name} {
            ${this.buildFields(x.fields, !x.type.endsWith(REFERENCE_DATA_END))}
          }` + '\n'
            );
          }
          default: {
            return '';
          }
        }
      })
    );
  }

  /**
   * Builds parsable GraphQL string from the filter definition.
   *
   * @param filter Filter definition
   * @returns GraphQL parsable string for the filter.
   */
  private filterToString(filter: any): string {
    if (filter.filters) {
      return `{ logic: "${filter.logic}", filters: [${filter.filters.map(
        (x: any) => this.filterToString(x)
      )}]}`;
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
    return [''].concat(
      fields.map((x) => {
        const kind = x.kind || x.type?.kind;
        switch (kind) {
          case 'SCALAR': {
            return x.name + '\n';
          }
          case 'LIST':
          case 'OBJECT': {
            const subFields = get(x, 'fields', []) || get(x, 'type.fields', []);
            if (subFields.length > 0) {
              return (
                `${x.name} {
              ${this.buildMetaFields(subFields)}
            }` + '\n'
              );
            } else {
              return '';
            }
          }
          default: {
            return '';
          }
        }
      })
    );
  }

  /**
   * Builds a form / resource query from widget settings.
   * TODO: we should pass directly the query definition, instead of the settings.
   *
   * @param settings Widget settings.
   * @param settings.query Query definition.
   * @param single Should take a single record
   * @returns GraphQL query.
   */
  public buildQuery(
    settings: { query: Query; [key: string]: any },
    single = false
  ) {
    const builtQuery = settings.query;
    if (
      builtQuery?.name &&
      builtQuery?.fields &&
      builtQuery.fields.length > 0
    ) {
      const fields = ['canUpdate\ncanDelete\n'].concat(
        this.buildFields(builtQuery.fields)
      );
      if (single) {
        return this.singleGraphQLQuery(builtQuery.name, fields);
      } else {
        return this.graphqlQuery(builtQuery.name, fields);
      }
    } else {
      return null;
    }
  }

  /**
   * Builds a graphQL query to get a single record from name and fields strings.
   *
   * @param name name of the query.
   * @param fields fields to fetch.
   * @returns GraphQL query.
   */
  public singleGraphQLQuery(name: string, fields: string[] | string) {
    return gql<QueryResponse, QueryVariables>`
    query GetSingleRecord($id: ID! $data: JSON) {
      ${name}(
      id: $id
      data: $data
      ) {
        ${fields}
      }
    }
  `;
  }

  /**
   * Builds a graphQL query from name and fields strings.
   *
   * @param name name of the query.
   * @param fields fields to fetch.
   * @returns GraphQL query.
   */
  public graphqlQuery(name: string, fields: string[] | string) {
    return gql<QueryResponse, QueryVariables>`
    query GetCustomQuery($first: Int, $skip: Int, $filter: JSON, $sortField: String, $sortOrder: String, $display: Boolean, $styles: JSON, $at: Date) {
      ${name}(
      first: $first
      skip: $skip
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
      display: $display
      styles: $styles
      at: $at
      ) {
        edges {
          node {
            ${fields}
          }
          meta
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  }

  /**
   * Builds a GraphQL meta query of a form / resource from widget settings.
   *
   * @param query Widget query.
   * @returns GraphQL meta query.
   */
  public buildMetaQuery(
    query: Query
  ): Observable<ApolloQueryResult<any>> | null {
    if (query && query.fields.length > 0) {
      const metaFields = this.buildMetaFields(query.fields);
      // check if has any valid value in metaFields
      if (metaFields.every((x: string) => !x)) {
        return null;
      }
      const metaQuery = gql`
        query GetCustomMetaQuery {
          _${query.name}Meta {
            ${metaFields}
          }
        }
      `;
      return this.apollo.query<any>({
        query: metaQuery,
        variables: {},
        fetchPolicy: 'cache-first',
      });
    } else {
      return null;
    }
  }

  /**
   * Get source query ( form / resource ) from query
   *
   * @param query custom query
   * @returns apollo query to get source
   */
  public getQuerySource(
    query: Query
  ): Observable<ApolloQueryResult<any>> | null {
    if (query) {
      const sourceQuery = gql`
      query GetSourceQuery {
        _${query.name}Meta {
          _source
        }
      }
    `;
      return this.apollo.query<any>({
        query: sourceQuery,
        variables: {},
        fetchPolicy: 'cache-first',
      });
    } else {
      return null;
    }
  }

  /**
   * Get metadata of form or resource
   *
   * @param id id of form or resource
   * @returns metadata query
   */
  public getQueryMetaData(id: string) {
    return this.apollo.query<QueryMetaDataQueryResponse>({
      query: GET_QUERY_META_DATA,
      variables: {
        id,
      },
      fetchPolicy: 'cache-first',
    });
  }

  /**
   * Returns the query name from a resource name.
   *
   * @param resourceName Resource name
   * @returns Query name
   */
  public getQueryNameFromResourceName(resourceName: string): any {
    const nameTrimmed = resourceName
      .replace(/_|-/g, '')
      .replace(/\s+(?=\d)/g, '_')
      .replace(/\s/g, '')
      .toLowerCase();
    return (
      this.availableQueries
        .getValue()
        .find((x) => x.type.name.toLowerCase() === nameTrimmed + 'connection')
        ?.name || ''
    );
  }

  /**
   * Finds the source of a query.
   * Used in order to find related forms.
   *
   * @param queryName Query name
   * @returns Apollo query.
   */
  public sourceQuery(queryName: string): any {
    const queries = this.availableQueries.getValue().map((x) => x.name);
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
        variables: {},
      });
    } else {
      return null;
    }
  }

  /**
   * Format fields for filters.
   *
   * @param query custom query.
   * @returns filter fields as Promise
   */
  public async getFilterFields(query: any): Promise<Field[]> {
    if (query) {
      const querySource$ = this.getQuerySource(query);
      const sourceQuery = querySource$ && firstValueFrom(querySource$);
      if (sourceQuery) {
        const res = await sourceQuery;
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            const source = get(res.data[field], '_source', null);
            if (source) {
              const metaQuery = firstValueFrom(this.getQueryMetaData(source));
              const res2 = await metaQuery;
              const dataset = res2.data.form
                ? res2.data.form
                : res2.data.resource
                ? res2.data.resource
                : null;
              if (!dataset) return [];
              return get(dataset, 'metadata', [])
                .filter((x: any) => x.filterable !== false)
                .map((x: any) => ({ ...x }));
            }
          }
        }
      } else {
        return [];
      }
    }
    return [];
  }

  /**
   * Get the right fields to be displayed in group
   *
   * @param type type to get fields from
   * @param previousTypes param to avoid circular dependencies and infinite loading
   * @returns field deconfined
   */
  public deconfineFields(type: any, previousTypes: Set<any>): any {
    return this.getFieldsFromType(type.name ?? type.ofType.name)
      .filter(
        (field) =>
          field.type.name !== 'ID' &&
          (field.type.kind === 'SCALAR' ||
            field.type.kind === 'LIST' ||
            field.type.kind === 'OBJECT') &&
          !previousTypes.has(field.type.name ?? field.type.ofType.name) //prevents infinite loops
      )
      .map((field: any) => {
        if (field.type.kind === 'LIST' || field.type.kind === 'OBJECT') {
          field.fields = this.deconfineFields(
            field.type,
            previousTypes?.add(field.type.name ?? field.type.ofType.name)
          );
        }
        return field;
      });
  }
}
