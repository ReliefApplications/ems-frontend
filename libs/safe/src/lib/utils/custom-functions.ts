import { Record } from '../models/record.model';
import { SafeAuthService } from '../services/auth/auth.service';

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param survey Survey instance
 * @param authService Shared auth service
 * @param record Current record
 */
const addCustomFunctions = (
  survey: any,
  authService: SafeAuthService,
  record?: Record | undefined
): void => {
  survey.FunctionFactory.Instance.register('createdAt', () =>
    record ? new Date(Number(record.createdAt) || '') : new Date()
  );
  survey.FunctionFactory.Instance.register('modifiedAt', () =>
    record ? new Date(Number(record.modifiedAt) || '') : new Date()
  );
  survey.FunctionFactory.Instance.register('createdBy', () => {
    if (record) {
      return record.createdBy?.name || '';
    } else {
      return authService.userValue?.name || '';
    }
  });
  survey.FunctionFactory.Instance.register('id', () =>
    record ? record.id : 'unknown id'
  );
  survey.FunctionFactory.Instance.register('weekday', (params: Date[]) =>
    new Date(params[0]).getDay()
  );
  survey.FunctionFactory.Instance.register('addDays', (params: any[]) => {
    const result = new Date(params[0]);
    result.setDate(result.getDate() + Number(params[1]));
    return result;
  });
};

export default addCustomFunctions;
