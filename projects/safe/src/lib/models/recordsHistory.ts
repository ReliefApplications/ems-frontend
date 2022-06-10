/**
 * Interface for change objects
 */
export interface Change {
  type: 'add' | 'remove' | 'modify';
  field: string;
  displayName: string;
  old?: string;
  new?: string;
}

/**
 * Type for record history objects
 */
export type RecordHistory = {
  created: Date;
  createdBy: string;
  changes: Change[];
}[];
