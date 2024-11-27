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
import { contextFormatElement, optionsContext } from './context-test-values';
import { ContextService } from './context.service';

describe('ContextService', () => {
  let service: ContextService;
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
});
