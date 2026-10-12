/**
 * Which records a query returns regarding drafts.
 * Mirrors the back-end RecordVisibility enum.
 */
export enum RecordVisibility {
  /** Submitted records only (default) */
  submitted = 'submitted',
  /** Draft records created by the current user */
  ownDrafts = 'ownDrafts',
  /** Draft records created by any user */
  allDrafts = 'allDrafts',
}

/**
 * Checks whether a record visibility targets draft records.
 *
 * @param visibility Record visibility to check
 * @returns True when drafts are displayed instead of submitted records
 */
export const isDraftVisibility = (
  visibility?: RecordVisibility | string | null
): boolean =>
  visibility === RecordVisibility.ownDrafts ||
  visibility === RecordVisibility.allDrafts;
