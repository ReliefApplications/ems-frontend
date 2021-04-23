import {Apollo, gql} from 'apollo-angular';
import { Injectable } from '@angular/core';

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
