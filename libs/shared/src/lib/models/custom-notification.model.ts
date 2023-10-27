/** Interface of Custom Notification objects */
export interface CustomNotification {
  id?: string;
  name?: string;
  description?: string;
  schedule?: string;
  notificationType?: string;
  resource?: string;
  layout?: string;
  template?: string;
  recipients?: any;
  recipientsType?: string;
  enabled?: boolean;
  lastExecution?: Date;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: string;
}

/** Model for add custom notification mutation response */
export interface AddCustomNotificationMutationResponse {
  addCustomNotification: CustomNotification;
}

/** Model for edit custom notification mutation response */
export interface UpdateCustomNotificationMutationResponse {
  editCustomNotification: CustomNotification;
}

/** Model for delete custom notification mutation response */
export interface DeleteCustomNotificationMutationResponse {
  deleteCustomNotification: CustomNotification;
}
