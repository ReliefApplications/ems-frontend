import { Record } from '../models/record.model';
import { SafeAuthService } from '../services/auth/auth.service';
import { functions } from './functions';

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
  // Register custom functions related to the record
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

  // Register custom functions from the functions folder
  functions.forEach((fn) => {
    survey.FunctionFactory.Instance.register(fn.name, fn.fn);
  });
};

export default addCustomFunctions;
