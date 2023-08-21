import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthModule,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { SafeLayoutComponent } from './layout.component';
import { HttpClientModule } from '@angular/common/http';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import {
  TranslateModule,
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
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

describe('SafeLayoutComponent', () => {
  let component: SafeLayoutComponent;
  let fixture: ComponentFixture<SafeLayoutComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: 'environment',
          useValue: {
            theme: {},
            availableLanguages: [],
          },
        },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      declarations: [SafeLayoutComponent],
      imports: [
        OAuthModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,
        IndicatorsModule,
        DividerModule,
        ButtonModule,
        TooltipModule,
        SidenavContainerModule,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op1 = controller.expectOne(GET_NOTIFICATIONS);

    op1.flush({
      data: {
        notifications: {
          edges: [],
          totalCount: '',
          pageInfo: {
            hasNextPage: '',
            endCursor: '',
          },
        },
      },
    });

    const op2 = controller.expectOne(NOTIFICATION_SUBSCRIPTION);

    op2.flush({
      data: {
        notification: {
          id: '',
          action: '',
          content: '',
          createdAt: '',
          channel: {
            id: '',
            title: '',
            application: {
              id: '',
            },
          },
          seenBy: {
            id: '',
            name: '',
          },
        },
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
