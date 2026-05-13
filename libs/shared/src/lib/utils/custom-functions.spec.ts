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

  it('registers without throwing', () => {
    expect(() => addCustomFunctions(authServiceMock)).not.toThrow();
  });
});
