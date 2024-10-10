import { gql } from 'apollo-angular';

/** Graphql request for getting resource  */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      fields
      metadata {
        __typename
        options
        multiSelect
        filterable
        filter
        automated
        name
        type
        editor
        fields {
          name
          type
        }
      }
    }
  }
`;

/** Graphql request for getting query types */
export const GET_QUERY_TYPES = gql`
  query GetQueryTypes {
    __schema {
      types {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            fields {
              name
              args {
                name
                type {
                  name
                  kind
                  inputFields {
                    name
                    type {
                      name
                      kind
                    }
                  }
                }
              }
              type {
                name
                kind
                ofType {
                  name
                  fields {
                    name
                    type {
                      name
                      kind
                      ofType {
                        name
                      }
                    }
                  }
                }
              }
            }
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
      queryType {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Get metadata of form / resource query definition.
 */
export const GET_QUERY_META_DATA = gql`
  query GetQueryMetaData($id: ID!) {
    resource(id: $id) {
      id
      metadata {
        name
        automated
        type
        editor
        filter
        multiSelect
        filterable
        options
        fields {
          name
          automated
          type
          editor
          filter
          multiSelect
          filterable
          options
        }
      }
    }
  }
`;

/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Graphql query for getting data set by filter layout */
export const GET_EMAIL_DATA_SET = gql`
  query getEmailDataset($query: JSON!) {
    dataset(query: $query) {
      records
      emails
      totalCount
      tabIndex
      __typename
    }
  }
`;

/** Graphql query for getting data set by filter layout */
export const GET_EMAIL_NOTIFICATIONS = gql`
  query EmailNotifications($applicationId: ID!, $limit: Int, $skip: Int) {
    emailNotifications(
      applicationId: $applicationId
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          applicationId
          createdAt
          emailDistributionList
          userSubscribed
          subscriptionList
          restrictSubscription
          name
          id
          notificationType
          createdBy
          isDraft
          isDeleted
          draftStepper
        }
      }
    }
  }
`;

/** Graphql query for getting data set by filter layout */
export const ADD_EMAIL_NOTIFICATION = gql`
  mutation Mutation($notification: EmailNotificationInputType!) {
    addEmailNotification(notification: $notification) {
      datasets {
        name
        query {
          name
          filter
          fields
        }
        resource
        reference
        tableStyle
        blockType
        textStyle
        individualEmail
        individualEmailFields
        sendAsAttachment
        pageSize
      }
      modifiedAt
      schedule
      createdBy
      emailLayout
      id
      isDeleted
      lastExecution
      name
      notificationType
      emailDistributionList
      subscriptionList
      restrictSubscription
      recipientsType
      status
    }
  }
`;

/** Graphql query for getting  EMAIL_NOTIFICATION */
export const GET_AND_UPDATE_EMAIL_NOTIFICATION = gql`
  mutation EditEmailNotification(
    $editEmailNotificationId: ID!
    $applicationId: ID!
    $notification: EmailNotificationInputType
  ) {
    editEmailNotification(
      id: $editEmailNotificationId
      application: $applicationId
      notification: $notification
    ) {
      createdAt
      createdBy
      datasets {
        name
        query {
          name
          filter
          fields
        }
        resource
        reference
        tableStyle
        blockType
        textStyle
        individualEmail
        individualEmailFields
        sendAsAttachment
        pageSize
      }
      id
      name
      notificationType
      emailDistributionList
      subscriptionList
      restrictSubscription
      status
      schedule
      modifiedAt
      emailLayout
      lastExecution
      recipientsType
      isDeleted
      isDraft
      draftStepper
    }
  }
`;

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      fields
    }
  }
`;

/** Graphql query for getting  EMAIL_DISTRIBUTION_LIST */
export const GET_DISTRIBUTION_LIST = gql`
  query EmailDistributionLists($applicationId: ID, $id: ID) {
    emailDistributionLists(applicationId: $applicationId, id: $id) {
      totalCount
      edges {
        node {
          bcc {
            resource
            reference
            query {
              name
              filter
              fields
            }
            inputEmails
          }
          cc {
            resource
            reference
            query {
              name
              filter
              fields
            }
            inputEmails
          }
          to {
            resource
            reference
            query {
              name
              filter
              fields
            }
            inputEmails
          }
          name
          id
          isDeleted
          createdBy
        }
      }
    }
  }
`;
/** Graphql query for add  EMAIL_DISTRIBUTION_LIST */
export const ADD_DISTRIBUTION_LIST = gql`
  mutation AddEmailDistributionList(
    $distributionList: JSON!
    $applicationId: ID
  ) {
    addEmailDistributionList(
      distributionList: $distributionList
      applicationId: $applicationId
    ) {
      bcc {
        resource
        reference
        query {
          name
          filter
          fields
        }
        inputEmails
      }
      cc {
        resource
        reference
        query {
          name
          filter
          fields
        }
        inputEmails
      }
      to {
        resource
        reference
        query {
          name
          filter
          fields
        }
        inputEmails
      }
      name
      id
      createdBy
      applicationId
    }
  }
`;

/**
 * Custom Template related queries
 */
export const ADD_CUSTOM_TEMPLATE = gql`
  mutation AddCustomTemplate($customTemplate: JSON!) {
    addCustomTemplate(customTemplate: $customTemplate) {
      subject
      header
      body
      banner
      footer
      id
      name
    }
  }
`;

/**
 * Distribution List related queries
 */
export const EDIT_DISTRIBUTION_LIST = gql`
  mutation EditAndGetDistributionList(
    $editAndGetDistributionListId: ID!
    $distributionList: JSON
  ) {
    editAndGetDistributionList(
      id: $editAndGetDistributionListId
      distributionList: $distributionList
    ) {
      bcc {
        resource
        reference
        query {
          name
          filter
          fields
        }
        inputEmails
      }
      cc {
        resource
        reference
        query {
          name
          filter
          fields
        }
        inputEmails
      }
      to {
        resource
        reference
        query {
          name
          filter
          fields
        }
        inputEmails
      }
      name
      id
      isDeleted
    }
  }
`;

/**
 * Custom Template related queries
 */
export const EDIT_CUSTOM_TEMPLATE = gql`
  mutation Mutation($editAndGetCustomTemplateId: ID!, $customTemplate: JSON) {
    editAndGetCustomTemplate(
      id: $editAndGetCustomTemplateId
      customTemplate: $customTemplate
    ) {
      banner
      body
      createdBy
      footer
      header
      id
      isDeleted
      subject
      name
    }
  }
`;

/** Graphql query for getting  CUSTOM_TEMPLATES */
export const GET_CUSTOM_TEMPLATES = gql`
  query CustomTemplates($applicationId: ID, $isFromEmailNotification: Boolean) {
    customTemplates(
      applicationId: $applicationId
      isFromEmailNotification: $isFromEmailNotification
    ) {
      totalCount
      edges {
        node {
          subject
          header
          body
          banner
          footer
          isDeleted
          createdBy
          id
          name
          isFromEmailNotification
        }
      }
    }
  }
`;

/**
 *Graphql query for Delete email notification permanently
 */
export const DELETE_EMAIL_NOTIFICATION = gql`
  mutation DeleteEmailNotification($id: ID!, $applicationId: ID!) {
    deleteEmailNotification(id: $id, applicationId: $applicationId) {
      success
      message
    }
  }
`;

// === GET API CONFIGURATIONS ===

/** Graphql query for getting multiple api configurations object with a cursor */
export const GET_API_CONFIGURATIONS = gql`
  query GetApiConfigurations(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
  ) {
    apiConfigurations(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          name
          status
          authType
          endpoint
          pingUrl
          settings
          permissions {
            canSee {
              id
              title
            }
            canUpdate {
              id
              title
            }
            canDelete {
              id
              title
            }
          }
          canSee
          canUpdate
          canDelete
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Graphql query for getting an api configuration by its id */
export const GET_API_CONFIGURATION = gql`
  query GetApiConfiguration($id: ID!) {
    apiConfiguration(id: $id) {
      id
      name
      status
      authType
      endpoint
      pingUrl
      settings
      graphQLEndpoint
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;

// === GET REFERENCE DATAS ===
/** Get list of ref data gql query definition */
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
  ) {
    referenceDatas(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          name
          modifiedAt
          apiConfiguration {
            id
            name
          }
          type
          permissions {
            canSee {
              id
              title
            }
            canUpdate {
              id
              title
            }
            canDelete {
              id
              title
            }
          }
          canSee
          canUpdate
          canDelete
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// === GET REFERENCE DATA ===
/** Get ref data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
      graphQLFilter
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      pageInfo {
        strategy
        cursorField
        cursorVar
        offsetVar
        pageVar
        pageSizeVar
        totalCountField
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;
