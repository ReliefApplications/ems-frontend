import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { environment } from 'projects/back-office/src/environments/environment';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { SafeAggregationBuilderComponent } from './aggregation-builder.component';
import { HttpClientModule } from '@angular/common/http';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';

describe('SafeAggregationBuilderComponent', () => {
  let component: SafeAggregationBuilderComponent;
  let fixture: ComponentFixture<SafeAggregationBuilderComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: 'environment', useValue: environment },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
      ],
      declarations: [SafeAggregationBuilderComponent],
      imports: [HttpClientModule, ApolloTestingModule],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAggregationBuilderComponent);
    component = fixture.componentInstance;
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

    const op2 = controller.expectOne('GetFormNames');

    op2.flush({
      data: {
        forms: {
          edges: [],
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
