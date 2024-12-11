/**
 * Interface for ActivityLog objects.
 */
export interface ActivityLog {
  /**
   * The ID of the activity log.
   */
  id: string;
  /**
   * The date and time of the activity log.
   */
  date: string;
  /**
   * The user who performed the activity.
   */
  user: string;
  /**
   * The action performed.
   */
  action: string;
  /**
   * The description of the activity.
   */
  description: string;
  /**
   * Date of creation
   */
  createdAt: Date;
}
