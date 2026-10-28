import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import localForage from 'localforage';
import { AppAbility, AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      imports: [HttpClientModule, ApolloTestingModule],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logout (L-02)', () => {
    let clearForage: jest.SpyInstance;
    let logOut: jest.SpyInstance;

    beforeEach(() => {
      localStorage.clear();
      clearForage = jest.spyOn(localForage, 'clear').mockResolvedValue();
      logOut = jest
        .spyOn(TestBed.inject(OAuthService), 'logOut')
        .mockImplementation(() => undefined);
    });

    afterEach(() => {
      jest.restoreAllMocks();
      localStorage.clear();
    });

    it('removes cached user data from the browser and keeps display preferences', async () => {
      localStorage.setItem('idtoken', 'jwt');
      localStorage.setItem('form:abc', '{"draft":true}');
      localStorage.setItem('reference-data:xlastRequest', '2026-10-28');
      localStorage.setItem('selectedPageSize', '50');
      localStorage.setItem('lang', 'fr');
      localStorage.setItem('date-lang', 'fr');
      localStorage.setItem('surveyLang', 'fr');
      localStorage.setItem('id_token', 'oauth-jwt');

      await service.logout();

      expect(localStorage.getItem('idtoken')).toBeNull();
      expect(localStorage.getItem('form:abc')).toBeNull();
      expect(localStorage.getItem('reference-data:xlastRequest')).toBeNull();
      expect(localStorage.getItem('selectedPageSize')).toBeNull();
      expect(localStorage.getItem('lang')).toBe('fr');
      expect(localStorage.getItem('date-lang')).toBe('fr');
      expect(localStorage.getItem('surveyLang')).toBe('fr');
      // Left to the OAuth library, which needs it to end the session
      expect(localStorage.getItem('id_token')).toBe('oauth-jwt');
      expect(clearForage).toHaveBeenCalledTimes(1);
    });

    it('clears the IndexedDB cache before ending the session', async () => {
      const order: string[] = [];
      clearForage.mockImplementation(async () => {
        order.push('forage');
      });
      logOut.mockImplementation(() => {
        order.push('logOut');
      });
      await service.logout();
      expect(order).toEqual(['forage', 'logOut']);
    });

    it('still ends the session when the IndexedDB cache cannot be cleared', async () => {
      clearForage.mockRejectedValue(new Error('blocked'));
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
      await service.logout();
      expect(logOut).toHaveBeenCalled();
    });
  });
});
