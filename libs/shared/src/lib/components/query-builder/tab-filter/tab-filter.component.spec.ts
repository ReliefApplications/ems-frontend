import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { TabFilterComponent } from './tab-filter.component';
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
import { GET_QUERY_TYPES } from '../graphql/queries';

describe('TabFilterComponent', () => {
  let component: TabFilterComponent;
  let fixture: ComponentFixture<TabFilterComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
      ],
      declarations: [TabFilterComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFilterComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      filters: new UntypedFormControl([]),
    });
    fixture.detectChanges();

    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
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
