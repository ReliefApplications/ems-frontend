import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SafeWorkflowService } from './workflow.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeWorkflowService', () => {
  let service: SafeWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      imports: [
        OAuthModule.forRoot(),
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
      ],
    });
    service = TestBed.inject(SafeWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
