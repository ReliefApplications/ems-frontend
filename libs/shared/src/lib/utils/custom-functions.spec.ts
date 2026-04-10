import { Model } from 'survey-core';
import { Record } from '../models/record.model';
import { AuthService } from '../services/auth/auth.service';
import addCustomFunctions from './custom-functions';

describe('addCustomFunctions', () => {
  const authServiceMock = {
    userValue: {
      name: 'Test User',
    },
  } as Partial<AuthService> as AuthService;

  beforeEach(() => {
    addCustomFunctions(authServiceMock);
  });

  it('should return false for isUpdate on record creation', () => {
    const survey = new Model({});

    survey.setPropertyValue('record', undefined);

    expect(survey.runExpression('isUpdate()')).toBe(false);
  });

  it('should return true for isUpdate on record edition', () => {
    const survey = new Model({});
    const record = {
      id: 'record-id',
    } as Record;

    survey.setPropertyValue('record', record);

    expect(survey.runExpression('isUpdate()')).toBe(true);
  });
});
