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
