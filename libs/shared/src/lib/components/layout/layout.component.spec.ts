import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { LayoutComponent } from './layout.component';
import { HttpClientModule } from '@angular/common/http';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_NOTIFICATIONS } from './graphql/queries';
import { NOTIFICATION_SUBSCRIPTION } from './graphql/subscriptions';
import { AppAbility } from '../../services/auth/auth.service';
import {
  BreadcrumbsModule,
  DividerModule,
  TooltipModule,
  ButtonModule,
  SidenavContainerModule,
  MenuModule,
} from '@oort-front/ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let controller: ApolloTestingController;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: 'environment',
          useValue: {
            theme: {},
            availableLanguages: ['en', 'fr', 'test'],
          },
        },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        TranslateService,
      ],
      declarations: [LayoutComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        DialogCdkModule,
        DividerModule,
        ButtonModule,
        SidenavContainerModule,
        BreadcrumbsModule,
        TooltipModule,
        MenuModule,
        ApolloTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
    translate = TestBed.inject(TranslateService);
    translate.addLangs(['en', 'fr', 'test']);
    translate.setDefaultLang('en');
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op1 = controller.expectOne(GET_NOTIFICATIONS);

    op1.flush({
      data: {
        notifications: {
          edges: [],
          totalCount: 0,
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    });

    const op2 = controller.expectOne(NOTIFICATION_SUBSCRIPTION);

    op2.flush({
      data: {
        notification: null,
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
