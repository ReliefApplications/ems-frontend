/** Model for Person object. */
export interface Person {
  id?: string;
  firstname?: string;
  lastname?: string;
  emailaddress?: string;
}

/** Query response for people */
export interface PeopleQueryResponse {
  people: Array<Person>;
}
