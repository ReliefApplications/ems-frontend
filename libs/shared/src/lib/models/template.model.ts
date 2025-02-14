/** Enum for types of template */
export enum TemplateTypeEnum {
  EMAIL = 'email',
}

/** Model for Template object */
export interface EmailTemplate {
  id?: string;
  type: TemplateTypeEnum;
  name: string;
  content: any;
}

/** Model for add template mutation response */
export interface AddEmailTemplateMutationResponse {
  addEmailTemplate: EmailTemplate;
}
/** Model for edit template mutation response */
export interface UpdateEmailTemplateMutationResponse {
  editEmailTemplate: EmailTemplate;
}
/** Model for delete template mutation response */
export interface DeleteEmailTemplateMutationResponse {
  deleteEmailTemplate: EmailTemplate;
}
