import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
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
                  : layouts;
              }
            });
        } else {
          const layouts = res.data.resource.layouts || [];
          return ids
            ? layouts.filter((x) => x.id && ids.includes(x.id))
            : layouts;
        }
      });
  }
}
