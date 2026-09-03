import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  DateTimeProvider,
  OAuthErrorEvent,
  OAuthLogger,
  OAuthService,
  OAuthStorage,
  OAuthSuccessEvent,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Subject } from 'rxjs';
import { AppAbility, AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let oauthService: OAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        {
          provide: 'environment',
          useValue: {
            module: 'frontoffice',
            backOfficeUri: 'http://localhost/',
            frontOfficeUri: 'http://localhost/',
          },
        },
        {
          provide: Router,
          useValue: { navigateByUrl: jest.fn(), navigate: jest.fn() },
        },
        { provide: OAuthStorage, useValue: localStorage },
        AppAbility,
      ],
      imports: [HttpClientModule, ApolloTestingModule],
    });

    service = TestBed.inject(AuthService);
    oauthService = TestBed.inject(OAuthService);
    oauthService.configure({
      issuer: 'https://login.microsoftonline.com/tenant/v2.0',
      redirectUri: 'http://localhost/',
      clientId: 'client',
      responseType: 'code',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initLoginSequence', () => {
    it('should reuse the existing session when the user is already authenticated', async () => {
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(true);
      jest.spyOn(oauthService, 'hasValidIdToken').mockReturnValue(true);
      const loadDiscoverySpy = jest
        .spyOn(oauthService, 'loadDiscoveryDocument')
        .mockResolvedValue(new OAuthSuccessEvent('discovery_document_loaded'));
      const loginFlowSpy = jest
        .spyOn(oauthService, 'initLoginFlow')
        .mockImplementation(() => undefined);

      await service.initLoginSequence();

      expect(loadDiscoverySpy).not.toHaveBeenCalled();
      expect(loginFlowSpy).not.toHaveBeenCalled();
      let authenticated = false;
      service.isAuthenticated$.subscribe((value) => (authenticated = value));
      expect(authenticated).toBe(true);
      let doneLoading = false;
      service.isDoneLoading$.subscribe((value) => (doneLoading = value));
      expect(doneLoading).toBe(true);
    });

    it('should remove OAuth callback parameters from the URL when reusing an existing session', async () => {
      window.history.replaceState(
        {},
        '',
        '/?code=abc&state=def&session_state=xyz'
      );
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(true);
      jest.spyOn(oauthService, 'hasValidIdToken').mockReturnValue(true);

      await service.initLoginSequence();

      expect(window.location.search).toBe('');
    });

    it('should refresh the tokens silently when the access token is expired and a refresh token exists', async () => {
      jest
        .spyOn(oauthService, 'hasValidAccessToken')
        .mockReturnValueOnce(false)
        .mockReturnValue(true);
      const refreshTokenSpy = jest
        .spyOn(oauthService, 'refreshToken')
        .mockResolvedValue({} as never);
      const loginFlowSpy = jest
        .spyOn(oauthService, 'initLoginFlow')
        .mockImplementation(() => undefined);
      const tryLoginSpy = jest
        .spyOn(oauthService, 'tryLogin')
        .mockResolvedValue(false);
      jest
        .spyOn(oauthService, 'loadDiscoveryDocument')
        .mockResolvedValue(new OAuthSuccessEvent('discovery_document_loaded'));
      localStorage.setItem('refresh_token', 'refresh-token');

      await service.initLoginSequence();

      expect(refreshTokenSpy).toHaveBeenCalled();
      expect(tryLoginSpy).not.toHaveBeenCalled();
      expect(loginFlowSpy).not.toHaveBeenCalled();
    });

    it('should process the OAuth callback instead of refreshing when the URL contains a fresh authorization code', async () => {
      window.history.replaceState({}, '', '/?code=abc&state=def');
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(false);
      const refreshTokenSpy = jest
        .spyOn(oauthService, 'refreshToken')
        .mockResolvedValue({} as never);
      const tryLoginSpy = jest
        .spyOn(oauthService, 'tryLogin')
        .mockResolvedValue(true);
      jest
        .spyOn(oauthService, 'loadDiscoveryDocument')
        .mockResolvedValue(new OAuthSuccessEvent('discovery_document_loaded'));
      localStorage.setItem('refresh_token', 'refresh-token');

      await service.initLoginSequence();

      expect(refreshTokenSpy).not.toHaveBeenCalled();
      expect(tryLoginSpy).toHaveBeenCalled();
    });

    it('should start a new login flow when no session can be reused', async () => {
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(false);
      const loginFlowSpy = jest
        .spyOn(oauthService, 'initLoginFlow')
        .mockImplementation(() => undefined);
      jest
        .spyOn(oauthService, 'loadDiscoveryDocument')
        .mockResolvedValue(new OAuthSuccessEvent('discovery_document_loaded'));

      await service.initLoginSequence();

      expect(loginFlowSpy).toHaveBeenCalled();
      let doneLoading = false;
      service.isDoneLoading$.subscribe((value) => (doneLoading = value));
      expect(doneLoading).toBe(true);
    });

    it('should not start a new login flow when the session could be reused after refresh failure', async () => {
      jest
        .spyOn(oauthService, 'hasValidAccessToken')
        .mockReturnValueOnce(false)
        .mockReturnValue(true);
      const loginFlowSpy = jest
        .spyOn(oauthService, 'initLoginFlow')
        .mockImplementation(() => undefined);
      jest
        .spyOn(oauthService, 'loadDiscoveryDocument')
        .mockResolvedValue(new OAuthSuccessEvent('discovery_document_loaded'));
      localStorage.setItem('refresh_token', 'refresh-token');
      jest
        .spyOn(oauthService, 'refreshToken')
        .mockRejectedValue(new Error('invalid_grant'));

      await service.initLoginSequence();

      expect(loginFlowSpy).not.toHaveBeenCalled();
    });

    it('should emit isDoneLoading false when the discovery document cannot be loaded', async () => {
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(false);
      jest
        .spyOn(oauthService, 'loadDiscoveryDocument')
        .mockRejectedValue(new Error('network error'));

      await service.initLoginSequence();

      let doneLoading: boolean | undefined;
      service.isDoneLoading$.subscribe((value) => (doneLoading = value));
      expect(doneLoading).toBe(false);
    });
  });

  describe('invalid_nonce_in_state event', () => {
    it('should not restart the login flow when the user is already authenticated', () => {
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(true);
      const loginFlowSpy = jest
        .spyOn(oauthService, 'initLoginFlow')
        .mockImplementation(() => undefined);

      const eventsSubject = (
        oauthService as unknown as { eventsSubject: Subject<OAuthErrorEvent> }
      ).eventsSubject;
      eventsSubject.next(new OAuthErrorEvent('invalid_nonce_in_state', {}));

      expect(loginFlowSpy).not.toHaveBeenCalled();
    });

    it('should restart the login flow when the user is not authenticated', () => {
      jest.spyOn(oauthService, 'hasValidAccessToken').mockReturnValue(false);
      const loginFlowSpy = jest
        .spyOn(oauthService, 'initLoginFlow')
        .mockImplementation(() => undefined);

      const eventsSubject = (
        oauthService as unknown as { eventsSubject: Subject<OAuthErrorEvent> }
      ).eventsSubject;
      eventsSubject.next(new OAuthErrorEvent('invalid_nonce_in_state', {}));

      expect(loginFlowSpy).toHaveBeenCalled();
    });
  });
});
