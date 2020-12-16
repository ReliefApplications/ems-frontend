import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetQueryTypes, GET_QUERY_TYPES } from '../graphql/queries';

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
    console.log(query);
    return query ? query.type.ofType.fields : [];
  }
}
