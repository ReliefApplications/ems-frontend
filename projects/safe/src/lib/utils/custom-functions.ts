import { Record } from '../models/record.model';

export default function addCustomFunctions(Survey: any, record?: Record | undefined, user?: string | undefined): void {
    Survey.FunctionFactory.Instance.register('createdAt', () => record ? new Date(Number(record.createdAt) || '') : new Date());
    Survey.FunctionFactory.Instance.register('modifiedAt', () => record ? new Date(Number(record.modifiedAt) || '') : new Date());
    Survey.FunctionFactory.Instance.register('createdBy', () => {
      let result;
      if (record){
        result = record.createdBy?.name ? record.createdBy?.name : 'no name related to this record';
      }
      else if (user) {
        result = user;
      } else {
        result = 'no records and username not found';
      }
      return result;
    });
    Survey.FunctionFactory.Instance.register('id', () => record ? record.id : 'unknown id');
    Survey.FunctionFactory.Instance.register('weekday', (params: Date[]) => (new Date(params[0])).getDay());
    Survey.FunctionFactory.Instance.register('addDays', (params: any[]) => {
        const result = new Date(params[0]);
        result.setDate(result.getDate() + Number(params[1]));
        return result;
    });
}
