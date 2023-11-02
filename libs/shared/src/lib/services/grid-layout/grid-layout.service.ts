import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ADD_LAYOUT, DELETE_LAYOUT, EDIT_LAYOUT } from './graphql/mutations';
import { GET_GRID_RESOURCE_META, GET_GRID_FORM_META } from './graphql/queries';
import {
  AddLayoutMutationResponse,
  DeleteLayoutMutationResponse,
  EditLayoutMutationResponse,
  Layout,
} from '../../models/layout.model';
import { firstValueFrom } from 'rxjs';
import { Connection } from '../../utils/graphql/connection.type';
import { ResourceQueryResponse } from '../../models/resource.model';
import { FormQueryResponse } from '../../models/form.model';

/** Fallback LayoutConnection */
const FALLBACK_LAYOUTS: Connection<Layout> = {
  edges: [],
  totalCount: 0,
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
  },
};

/**
 * Shared service to manage grid predefined layouts.
 */
@Injectable({
  providedIn: 'root',
})
export class GridLayoutService {
  /**
   * Constructor the GridLayoutService
   *
   * @param apollo The apollo service
   */
  constructor(private apollo: Apollo) {}

  /**
   * Gets list of layouts from source
   *
   * @param source source id
   * @param options query options
   * @param options.ids list of layout id
   * @param options.first number of items to get
   * @returns {Promise<Connection<Layout>>} A promise with a connection layout of the given source
   */
  async getLayouts(
    source: string,
    options: { ids?: string[]; first?: number }
  ): Promise<Connection<Layout>> {
    return await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_GRID_RESOURCE_META,
        variables: {
          resource: source,
          ids: options.ids,
          first: options.first,
        },
      })
    ).then(async ({ errors, data }) => {
      if (errors) {
        return await firstValueFrom(
          this.apollo.query<FormQueryResponse>({
            query: GET_GRID_FORM_META,
            variables: {
              id: source,
              ids: options.ids,
              first: options.first,
            },
          })
        ).then((res2) => {
          if (res2.errors) {
            return FALLBACK_LAYOUTS;
          } else {
            return res2.data.form.layouts || FALLBACK_LAYOUTS;
          }
        });
      } else {
        return data.resource.layouts || FALLBACK_LAYOUTS;
      }
    });
  }

  /**
   * Edits a layout.
   *
   * @param layout layout to edit
   * @param value new value of the layout
   * @param resource resource the layout is attached to ( optional )
   * @param form form the layout is attached to ( optional )
   * @returns Mutation observable
   */
  public editLayout(
    layout: Layout,
    value: Layout,
    resource?: string,
    form?: string
  ) {
    return this.apollo.mutate<EditLayoutMutationResponse>({
      mutation: EDIT_LAYOUT,
      variables: {
        id: layout.id,
        resource,
        form,
        layout: value,
      },
    });
  }

  /**
   * Create a new layout
   *
   * @param value the value of the layout
   * @param resource resource the layout is attached to ( optional )
   * @param form form the layout is attached to ( optional )
   * @returns Mutation observable
   */
  public addLayout(value: Layout, resource?: string, form?: string) {
    return this.apollo.mutate<AddLayoutMutationResponse>({
      mutation: ADD_LAYOUT,
      variables: {
        resource,
        form,
        layout: value,
      },
    });
  }

  /**
   * Delete a layout
   *
   * @param layout layout to edit
   * @param resource resource the layout is attached to ( optional )
   * @param form form the layout is attached to ( optional )
   * @returns Mutation observable
   */
  public deleteLayout(layout: Layout, resource?: string, form?: string) {
    return this.apollo.mutate<DeleteLayoutMutationResponse>({
      mutation: DELETE_LAYOUT,
      variables: {
        resource,
        form,
        id: layout.id,
      },
    });
  }
}
