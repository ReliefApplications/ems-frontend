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
  enabled?: boolean;
  lastExecution?: Date;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: string;
}
