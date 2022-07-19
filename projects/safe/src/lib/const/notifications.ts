/** Notifications */
export const NOTIFICATIONS = {
  appPublished: (name: any): string => `Application ${name} published.`,
  userInvalidActions: (action: any): string => `User could not be ${action}.`,
  accessNotProvided: (type: any, error?: any): string =>
    `No access provided to this ${type}. ${error ? error : ''}`,
  userRolesUpdated: (username: any): string => `${username} roles updated.`,
  usersActions: (type: any, length: any): string =>
    length > 1 ? `${length} users were ${type}.` : `user was ${type}.`,
  objectNotUpdated: (type: any, error: any): string =>
    `${type} is locked for edition. ${error}`,
  objectEdited: (type: any, name: any): string => `${name} ${type} edited.`,
  objectNotEdited: (type: any, error: any): string =>
    `${type} not edited. ${error}`,
  objectDuplicated: (type: any, name: any): string =>
    `The ${type} ${name} was successfully  duplicated.`,
  objectNotDuplicated: (type: any, error: any): string =>
    `The ${type} was not duplicated. ${error}`,
  objectAlreadyExists: (type: any, value: any): string =>
    `The ${type} ${value} already exists on this application.`,
  objectCreated: (type: any, name: any): string => `${name} ${type} created.`,
  objectNotCreated: (type: any, error: any): string =>
    `The ${type} was not created. ${error}`,
  objectDeleted: (value: any): string => `${value} deleted.`,
  objectNotDeleted: (value: any, error: any): string =>
    `The ${value} was not deleted. ${error}`,
  objectReordered: (type: any): string => `${type} reordered.`,
  objectLoadedFromCache: (type: string): string => `${type} loaded from cache.`,
  objectIsLocked: (name: any): string =>
    `${name} edition is locked by another user.`,
  objectUnlocked: (name: any): string =>
    `${name} edition has been unlocked by another user.`,
  objectAccessDenied: (type: string): string =>
    `You don't have permission to see the ${type}.`,
  goToStep: (step: any): string => `Back to ${step} step.`,
  statusUpdated: (status: any): string => `Status updated to ${status}.`,
  noObjectOpened: (value: any): string => `No opened ${value}.`,
  addRowsToRecord: (
    length: any,
    field: any,
    value: any
  ): string => `Added ${length} row${length > 1 ? 's' : ''} 
        to the field ${field} in the record ${value}.`,
  formatInvalid: (format: string): string =>
    `Please upload a valid .${format} file.`,
  cannotGoToNextStep: 'Cannot go to next step.',
  copied: 'Copied!',
  recordDoesNotMatch:
    'Selected record(s) do not match with some fields from this form.',
  recordUploadSuccess: 'Records upload successful.',
  emailRegistered:
    'Some emails are already part of the application and will not be invited.',
  emailTooLong: (
    error: any
  ): string => `Failed to open your email client with selected records in the body. 
        Either your browser or your email client does not support such long mailto command. ${error}`,
  emailClientNotResponding: (error: any): string =>
    `Failed to open your email client even without body. ${error}`,
  emailBodyCopiedToClipboard:
    'Email body copied to clipboard, you can now past it to the opened email.',
  dataRecovered: 'The data has been recovered',
  profileSaved: 'Preferences saved.',
  appEdited: 'This application has been updated by someone else.',
  pingResponseAuthToken:
    'Authentication token fetched, ping again to get the actual response.',
  pingResponseReceived: 'Received positive response from ping request.',
  pingResponseError: 'ERROR during the PING request.',
  aggregationError: 'Aggregation failed to execute.',
  userImportFail: 'The user import has failed',
};
