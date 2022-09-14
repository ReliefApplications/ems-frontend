import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  AddLayoutMutationResponse,
  ADD_LAYOUT,
  deleteLayoutMutationResponse,
  DELETE_LAYOUT,
  EditLayoutMutationResponse,
  EDIT_LAYOUT,
} from '../graphql/mutations';
import {
  GetResourceByIdQueryResponse,
  GET_GRID_RESOURCE_META,
  GetFormByIdQueryResponse,
  GET_GRID_FORM_META,
} from '../graphql/queries';
import { Layout } from '../models/layout.model';

/**
 * Shared service to manage grid predefined layouts.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeGridLayoutService {
  /**
   * Constructor the SafeGridLayoutService
   *
   * @param apollo The apollo service
   */
  constructor(private apollo: Apollo) {}

  /**
   * Gets list of layouts from source
   *
   * @param source source id
   * @param ids selected layouts ( optional )
   * @returns list of layouts
   */
  async getLayouts(source: string, ids?: string[]): Promise<Layout[]> {
    return await this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_GRID_RESOURCE_META,
        variables: {
          resource: source,
        },
      })
      .toPromise()
      .then(async (res) => {
        if (res.errors) {
          return await this.apollo
            .query<GetFormByIdQueryResponse>({
              query: GET_GRID_FORM_META,
              variables: {
                id: source,
              },
            })
            .toPromise()
            .then((res2) => {
              if (res2.errors) {
                return [];
              } else {
                const layouts = res2.data.form.layouts || [];
                return ids
                  ? layouts.filter((x) => x.id && ids.includes(x.id))
                  : [];
              }
            });
        } else {
          const layouts = res.data.resource.layouts || [];
          return ids
            ? layouts
                .filter((x) => x.id && ids.includes(x.id))
                .sort(
                  (a, b) => ids.indexOf(a.id || '') - ids.indexOf(b.id || '')
                )
            : [];
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
    return this.apollo.mutate<deleteLayoutMutationResponse>({
      mutation: DELETE_LAYOUT,
      variables: {
        resource,
        form,
        id: layout.id,
      },
    });
  }
}
