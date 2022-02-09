import { Apollo } from 'apollo-angular';
import { EDIT_RECORDS } from '../graphql/mutations';
import { Record } from '../models/record.model';
import { SafeAuthService } from '../services/auth.service';

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param survey Survey instance
 * @param authService Shared auth service
 * @param apollo Apollo client
 * @param record Current record
 */
const addCustomFunctions = (
  survey: any,
  authService: SafeAuthService,
  apollo: Apollo,
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
  survey.FunctionFactory.Instance.register('editSelected', (params: any[]) => {
    const records = params[0];
    const fieldName = params[1];
    const value = params[2];
    apollo
      .mutate({
        mutation: EDIT_RECORDS,
        variables: {
          ids: records,
          data: { [fieldName]: value },
        },
      })
      .subscribe();
  });
};

export default addCustomFunctions;
