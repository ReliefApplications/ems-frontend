import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetQueryTypes, GET_QUERY_TYPES } from '../graphql/queries';
import { UntypedFormBuilder } from '@angular/forms';
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
  providedIn: 'root',
})
export class QueryBuilderService {
  /** Available forms / resources queries */
  private availableQueries = new BehaviorSubject<any[]>([]);
  /** @returns Available forms / resources queries as observalbe */
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
   * @param formBuilder Angular form builder
   */
  constructor(private apollo: Apollo, private formBuilder: UntypedFormBuilder) {
    this.apollo
      .query<GetQueryTypes>({
        query: GET_QUERY_TYPES,
      })
      .subscribe((res) => {
        // eslint-disable-next-line no-underscore-dangle
        this.availableTypes.next(res.data.__schema.types);
        this.availableQueries.next(
          // eslint-disable-next-line no-underscore-dangle
          res.data.__schema.queryType.fields.filter((x: any) =>
            x.name.startsWith('all')
          )
        );
        // eslint-disable-next-line no-underscore-dangle
        this.userFields = res.data.__schema.types
          .find((x: any) => x.name === 'User')
          .fields.filter((x: any) => USER_FIELDS.includes(x.name));
      });
  }

  /**
   * Gets list of fields from a query name.
   *
   * @param queryName Form / Resource query name.
   * @returns List of fields of this structure.
   */
  public getFields(queryName: string): any[] {
    const query = this.availableQueries
      .getValue()
      .find((x) => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes
      .getValue()
      .find((x) => x.name === typeName);
    return type
      ? type.fields
          .filter((x: any) => !NON_SELECTABLE_FIELDS.includes(x.name))
          .map((x: any) => {
            if (x.type.kind === 'OBJECT') {
              return Object.assign({}, x, {
                kind: 'OBJECT',
                fields: x.type.fields.filter(
                  (y: any) =>
                    y.type.kind === 'SCALAR' &&
                    !NON_SELECTABLE_FIELDS.includes(y.name) &&
                    (x.type.name !== 'User' || USER_FIELDS.includes(y.name))
                ),
              });
            }
            return x;
          })
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
      : [];
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
    return type
      ? type.fields
          .filter((x: any) => !NON_SELECTABLE_FIELDS.includes(x.name))
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
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
      : [];
  }

  /**
   * Gets list of LIST fields from a query name.
   *
   * @param queryName Form / Resource query name.
   * @returns List of LIST fields of this structure.
   */
  public getListFields(queryName: string): any[] {
    const query = this.availableQueries
      .getValue()
      .find((x) => x.name === queryName);
    const typeName = query?.type?.name.replace('Connection', '') || '';
    const type = this.availableTypes
      .getValue()
      .find((x) => x.name === typeName);
    return type
      ? type.fields
          .filter((x: any) => x.type.kind === 'LIST')
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
      : [];
  }

  /**
   * Builds the fields part of the GraphQL query.
   *
   * @param fields List of fields to query.
   * @returns QL document to build the query.
   */
  private buildFields(fields: any[]): any {
    return ['id\n'].concat(
      fields.map((x) => {
        switch (x.kind) {
          case 'SCALAR': {
            return x.name + '\n';
          }
          case 'LIST': {
            return (
              `${x.name} (
            sortField: ${x.sort.field ? `"${x.sort.field}"` : null},
            sortOrder: "${x.sort.order}",
            filter: ${this.filterToString(x.filter)}
          ) {
            ${['canUpdate\ncanDelete\n'].concat(this.buildFields(x.fields))}
          }` + '\n'
            );
          }
          case 'OBJECT': {
            return (
              `${x.name} {
            ${this.buildFields(x.fields)}
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
   * @returns GraphQL parsable strinf for the filter.
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
          case 'LIST': {
            return x.fields && x.fields.length > 0
              ? `${x.name} {
                ${
                  x.fields && x.fields.length > 0
                    ? this.buildMetaFields(x.fields)
                    : ''
                }
              }` + '\n'
              : x.name + '\n';
          }
          case 'OBJECT': {
            return (
              `${x.name} {
            ${
              x.fields && x.fields.length > 0
                ? this.buildMetaFields(x.fields)
                : ''
            }
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
   * Builds a form / resource query from widget settings.
   * TODO: we should pass directly the query definition, instead of the settings.
   *
   * @param settings Widget settings.
   * @returns GraphQL query.
   */
  public buildQuery(settings: any): any {
    const builtQuery = settings.query;
    if (builtQuery?.fields?.length > 0) {
      const fields = ['canUpdate\ncanDelete\n'].concat(
        this.buildFields(builtQuery.fields)
      );
      return this.graphqlQuery(builtQuery.name, fields);
    } else {
      return null;
    }
  }

  /**
   * Builds a graphQL query from name and fields strings.
   *
   * @param name name of the query.
   * @param fields fields to fetch.
   * @returns GraphQL query.
   */
  public graphqlQuery(name: string, fields: any) {
    return gql`
    query GetCustomQuery($first: Int, $skip: Int, $filter: JSON, $sortField: String, $sortOrder: String, $display: Boolean, $styles: JSON) {
      ${name}(
      first: $first,
      skip: $skip,
      sortField: $sortField,
      sortOrder: $sortOrder,
      filter: $filter,
      display: $display
      styles: $styles
      ) {
        edges {
          node {
            ${fields}
          }
          meta
        }
        totalCount
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
  public buildMetaQuery(query: any): Observable<ApolloQueryResult<any>> | null {
    if (query && query.fields.length > 0) {
      const metaFields = this.buildMetaFields(query.fields);
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
}
