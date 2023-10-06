/** Enum for types of template */
export enum TemplateTypeEnum {
  EMAIL = 'email',
}

/** Model for Template object */
export interface Template {
  id?: string;
  type: TemplateTypeEnum;
  name: string;
  content: any;
}

/** Model for add template mutation response */
export interface AddTemplateMutationResponse {
  addTemplate: Template;
}
/** Model for edit template mutation response */
export interface UpdateTemplateMutationResponse {
  editTemplate: Template;
}
/** Model for delete template mutation response */
export interface DeleteTemplateMutationResponse {
  deleteTemplate: Template;
}
