import { GraphqlNodesResponse } from './graphql-query.model';

/** Model for Person object. */
export interface Person {
  id?: string;
  firstname?: string;
  lastname?: string;
  emailaddress?: string;
}

/** Query response for people using cursor */
export interface PeopleNodeQueryResponse {
  people: GraphqlNodesResponse<Person>;
}
