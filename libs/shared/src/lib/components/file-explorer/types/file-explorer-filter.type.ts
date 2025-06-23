/** File explorer filter interface */
export interface FileExplorerFilter {
  search?: string;
}

/**
 * File explorer tag selection.
 */
export interface FileExplorerTagSelection {
  aetiologyid?: number;
  informationconfidentialityid?: number;
  countryid?: number;
  diseasecondid?: number;
  documentcategoryid?: number;
  documenttypeid?: number;
  hazardid?: number;
  ihrcommunicationid?: number;
  assignmentfunctionid?: number;
  roletypeid?: number;
  languageid?: number;
  occurrenceid?: string;
  occurrencetype?: number;
  sourceofinformationid?: number;
  syndromeid?: number;
  regionid?: number;
}

export type FileExplorerTagKey = Extract<
  keyof FileExplorerTagSelection,
  string
>;
