import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AggregationBuilderService {

  constructor(private apollo: Apollo) { }

  public buildAggregation(pipeline: string): any {
    if (pipeline) {
      const query = gql`
        query GetCustomAggregation($pipeline: JSON!) {
          recordsAggregation(pipeline: $pipeline)
        }
      `;
      return this.apollo.watchQuery<any>({
        query,
        variables: {
          pipeline: JSON.parse(pipeline)
        }
      });
    } else {
      return null;
    }
  }
}
