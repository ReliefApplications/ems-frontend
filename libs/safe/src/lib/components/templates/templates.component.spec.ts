import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeTemplatesComponent } from './templates.component';
import { ButtonModule, MenuModule } from '@oort-front/ui';
import { SafeApplicationService } from '../../services/application/application.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../services/auth/auth.service';
import { SafeEmptyModule } from '../ui/empty/empty.module';

describe('SafeTemplatesComponent', () => {
  let component: SafeTemplatesComponent;
  let fixture: ComponentFixture<SafeTemplatesComponent>;
  let mockSafeApplicationService: SafeApplicationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
        SafeApplicationService,
        AppAbility,
      ],
      declarations: [SafeTemplatesComponent],
      imports: [
        HttpClientModule,
        DialogCdkModule,
        SafeEmptyModule,
        ButtonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MenuModule,
        ApolloTestingModule,
      ],
    }).compileComponents();

    mockSafeApplicationService = TestBed.inject(SafeApplicationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTemplatesComponent);
    component = fixture.componentInstance;
    component.applicationService = mockSafeApplicationService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
