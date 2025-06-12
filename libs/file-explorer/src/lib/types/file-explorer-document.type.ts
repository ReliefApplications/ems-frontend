export interface FileExplorerDocumentUser {
  firstname: string;
  lastname: string;
}

export interface FileExplorerDocument {
  id: string;
  filename: string;
  createddate: string;
  modifieddate: string;
  modifiedbyuser: FileExplorerDocumentUser;
}
