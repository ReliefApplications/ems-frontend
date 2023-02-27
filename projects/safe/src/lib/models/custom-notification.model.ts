// id: {
//   type: GraphQLID,
//   resolve(parent) {
//     return parent._id ? parent._id : parent.id;
//   },
// },
// name: { type: GraphQLString },
// description: { type: GraphQLString },
// schedule: { type: GraphQLString },
// notificationType: { type: GraphQLString },
// resource: { type: GraphQLID },
// layout: { type: GraphQLID },
// template: { type: GraphQLID },
// recipients: { type: GraphQLJSON },
// enabled: { type: GraphQLBoolean },
// lastExecution: { type: GraphQLString },
// createdAt: { type: GraphQLString },
// modifiedAt: { type: GraphQLString },
// status: { type: GraphQLString },

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
