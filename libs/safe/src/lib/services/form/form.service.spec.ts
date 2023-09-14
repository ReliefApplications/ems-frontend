import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { SafeFormService } from './form.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeFormService', () => {
  let service: SafeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        UntypedFormBuilder,
        AppAbility,
      ],
      imports: [
        HttpClientModule,
        DialogCdkModule,
        ApolloTestingModule,
        OAuthModule.forRoot(),
      ],
    });
    service = TestBed.inject(SafeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
