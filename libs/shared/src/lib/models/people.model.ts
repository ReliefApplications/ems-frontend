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

/**
 * Displayed value expression for a person
 *
 * @param person Displayed person
 * @returns Display value for the person
 */
export const getPersonLabel = (person: Person) => {
  const fullname =
    person.firstname && person.lastname
      ? `${person.firstname}, ${person.lastname}`
      : person.firstname || person.lastname;
  return `${fullname} (${person.emailaddress})`;
};
