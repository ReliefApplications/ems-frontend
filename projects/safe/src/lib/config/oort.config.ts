/*
 * Config file to customize the Oort instance
 */
export enum AuthenticationType {
  azureAD = 0,
  keycloak = 1,
}

export const config = {
  // Authentication using custon openID connect server
  authenticationType: AuthenticationType.keycloak,
};
