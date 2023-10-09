/** Model for graphql query response */
export interface PeopleQueryResponse {
  data: {
    users: Person[];
  };
}

/** Model for Person object. */
export interface Person {
  id?: string;
  firstname?: string;
  lastname?: string;
  emailaddress?: string;
}
