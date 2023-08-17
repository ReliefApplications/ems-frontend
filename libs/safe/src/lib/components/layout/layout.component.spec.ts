import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SafeLayoutComponent } from './layout.component';
import { HttpClientModule } from '@angular/common/http';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  MenuModule,
  SidenavContainerModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_NOTIFICATIONS } from './graphql/queries';
import { NOTIFICATION_SUBSCRIPTION } from './graphql/subscriptions';
import { AppAbility } from '../../services/auth/auth.service';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ButtonModule } from '@oort-front/ui';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeLayoutComponent', () => {
  let component: SafeLayoutComponent;
  let fixture: ComponentFixture<SafeLayoutComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: 'environment',
          useValue: { availableLanguages: 2, theme: {} },
        },
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
        TranslateModule.forRoot(),
        MenuModule,
        ApolloTestingModule,
      ],
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
