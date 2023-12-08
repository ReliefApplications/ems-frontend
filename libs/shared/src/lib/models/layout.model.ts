/**
 * Interface for Layout objects.
 */
export interface Layout {
  id?: string;
  name?: string;
  query?: any;
  display?: any;
}

/** Model for add layout mutation response */
export interface AddLayoutMutationResponse {
  addLayout: Layout;
}

/** Model for edit layout mutation response */
export interface EditLayoutMutationResponse {
  editLayout: Layout;
}

/** Model for delete layout mutation response */
export interface DeleteLayoutMutationResponse {
  deleteLayout: Layout;
}
