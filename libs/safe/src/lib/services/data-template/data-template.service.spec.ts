import { TestBed } from '@angular/core/testing';
import { DataTemplateService } from './data-template.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('DataTemplateService', () => {
  let service: DataTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [
        OAuthModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientModule,
        ApolloTestingModule,
      ],
    });
    service = TestBed.inject(DataTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
