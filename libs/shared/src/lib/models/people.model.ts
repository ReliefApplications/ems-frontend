/** Model for a person returned by Common Services users query */
export interface People {
  userid: string;
  firstname?: string;
  lastname?: string;
  emailaddress?: string;
}

/** Variables for people search */
export interface SearchPeopleVars {
  filter?: any;
  first?: number;
  skip?: number;
}

/** Search people GraphQL response */
export interface SearchPeopleQueryResponse {
  users: People[];
}

/** Get people by id GraphQL response */
export interface GetPeopleByIdResponse {
  users: People[];
}
