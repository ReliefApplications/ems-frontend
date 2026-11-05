import { Version } from './form.model';

/**
 * Interface for change objects
 */
export interface Change {
  type: 'add' | 'remove' | 'modify';
  field: string;
  displayName: string;
  /** Target language of a translated field, if any */
  lang?: string;
  old?: string;
  new?: string;
}

/**
 * Type for record history objects
 */
export type RecordHistory = {
  createdAt: Date;
  createdBy: string;
  changes: Change[];
  version?: Version;
}[];

/** Get record history query response interface */
export interface RecordHistoryResponse {
  recordHistory: RecordHistory;
}
