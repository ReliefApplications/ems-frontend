/** File explorer document user interface */
export interface FileExplorerDocumentUser {
  firstname: string;
  lastname: string;
  emailaddress?: string;
}

/** File explorer document interface */
export interface FileExplorerDocument {
  id: string;
  filename: string;
  createddate: string;
  modifieddate: string;
  modifiedbyuser: string;
  documenttypename: string;
}
