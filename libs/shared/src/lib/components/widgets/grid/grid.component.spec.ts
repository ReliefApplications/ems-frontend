import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { GridWidgetComponent } from './grid.component';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { UntypedFormBuilder } from '@angular/forms';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';

describe('GridWidgetComponent', () => {
  let component: GridWidgetComponent;
  let fixture: ComponentFixture<GridWidgetComponent>;
  let controller: ApolloTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
        UntypedFormBuilder,
      ],
      declarations: [GridWidgetComponent],
      imports: [
        DialogCdkModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridWidgetComponent);
    component = fixture.componentInstance;
    component.settings = {
      resource: {},
      layout: {},
      query: {},
    };
    fixture.detectChanges();

    const op1 = controller.expectOne(GET_QUERY_TYPES);

    op1.flush({
      data: {
        __schema: {
          types: [],
        },
        fields: [],
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
