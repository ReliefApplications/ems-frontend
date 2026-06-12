import { DialogModule } from '@angular/cdk/dialog';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShadowDomService, SnackbarService } from '@oort-front/ui';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { StorybookTranslateModule } from '../../../../.storybook/storybook-translate.module';
import { ApplicationService } from '../application/application.service';
import { AppAbility } from '../auth/auth.service';
import { AuthService } from '../auth/auth.service';
import { contextFormatElement, optionsContext } from './context-test-values';
import { ContextService } from './context.service';

describe('ContextService', () => {
  let service: ContextService;
  let authService: AuthService;
  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslateService,
        {
          provide: 'environment',
          useValue: {
            availableLanguages: [],
            theme: {},
          },
        },
        OAuthService,
        OAuthLogger,
        SnackbarService,
        ApplicationService,
        ShadowDomService,
        FormBuilder,
        DateTimeProvider,
        AppAbility,
        UrlHelperService,
      ],
      imports: [
        ApolloTestingModule,
        StorybookTranslateModule,
        HttpClientModule,
        DialogModule,
        FormsModule,
        RouterModule,
      ],
    });
    service = TestBed.inject(ContextService);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('Parse HTML with context data', () => {
    let replaceContext!: any;
    beforeAll(() => {
      replaceContext = jest.spyOn(service, 'replaceContext');
    });
    it('executes replaceContext function', () => {
      service.updateSettingsContextContent(
        { text: contextFormatElement.before },
        { contextData: optionsContext }
      );
      expect(replaceContext).toHaveBeenCalled();
    });
    it('executes html element parse with injected context correctly', () => {
      service.context = optionsContext;
      const result = service.updateSettingsContextContent(
        { text: contextFormatElement.before },
        { contextData: optionsContext }
      );
      expect(result.settings.text).toEqual(contextFormatElement.after);
    });
    it('executes html element parse with injected context correctly if no context set', () => {
      const result = service.updateSettingsContextContent(
        { text: contextFormatElement.before },
        { contextData: null as any }
      );
      expect(result.settings.text).toEqual(contextFormatElement.before);
    });
  });

  describe('Replace runtime placeholders', () => {
    it('replaces current user fields and WHO attributes in filter objects', () => {
      authService.user.next({
        username: 'jane.doe',
        firstName: 'Jane',
        lastName: 'Doe',
        attributes: {
          country: 'France',
          region: 'Europe',
        },
      });

      const result = service.replaceFilter(
        {
          owner: '{{user.username}}',
          fullName: '{{user.firstName}}',
          country: '{{user.country}}',
          region: '{{user.attributes.region}}',
          countries: '{{filter.countries}}',
        },
        {
          countries: ['France', 'Belgium'],
        }
      );

      expect(result).toEqual({
        owner: 'jane.doe',
        fullName: 'Jane',
        country: 'France',
        region: 'Europe',
        countries: ['France', 'Belgium'],
      });
    });

    it('injects current user placeholders in context filters', () => {
      authService.user.next({
        username: 'jane.doe',
        attributes: {
          country: 'France',
        },
      });
      service.filter.next({
        status: 'Active',
      });

      const result = service.injectContext({
        logic: 'and' as const,
        filters: [
          {
            field: 'owner',
            operator: 'eq',
            value: '{{user.username}}',
          },
          {
            field: 'country',
            operator: 'eq',
            value: '{{user.country}}',
          },
          {
            field: 'status',
            operator: 'eq',
            value: '{{filter.status}}',
          },
        ],
      });

      expect(result).toEqual({
        logic: 'and',
        filters: [
          {
            field: 'owner',
            operator: 'eq',
            value: 'jane.doe',
          },
          {
            field: 'country',
            operator: 'eq',
            value: 'France',
          },
          {
            field: 'status',
            operator: 'eq',
            value: 'Active',
          },
        ],
      });
    });
  });
});
