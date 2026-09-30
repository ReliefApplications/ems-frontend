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
import { GET_QUERY_TYPES } from '../../../services/query-builder/graphql/queries';
import { Ability } from '@casl/ability';
import { RecordVisibility } from '../../../models/record-visibility.model';

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
        {
          provide: Ability,
          useValue: { can: jest.fn(), cannot: jest.fn() },
        },
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
    })
      .overrideComponent(GridWidgetComponent, { set: { template: '' } })
      .compileComponents();

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
    const op1 = controller.expectOne(GET_QUERY_TYPES);

    op1.flush({
      data: {
        types: {
          availableQueries: [],
          userFields: [],
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

  it('should derive draft visibility and actions from the selected layout', () => {
    component.settings = {
      template: 'template-id',
      recordVisibility: RecordVisibility.allDrafts,
      floatingButtons: [{ show: true }],
    };

    component.onLayoutChange({ recordVisibility: RecordVisibility.submitted });

    expect(component.isDraftLayout).toBe(false);
    expect(component.gridSettings.recordVisibility).toBe(
      RecordVisibility.submitted
    );
    expect(component.gridActions).toHaveLength(1);

    component.onLayoutChange({ recordVisibility: RecordVisibility.allDrafts });

    expect(component.isDraftLayout).toBe(true);
    expect(component.gridSettings.recordVisibility).toBe(
      RecordVisibility.allDrafts
    );
    expect(component.gridActions).toEqual([]);

    component.onLayoutChange({});

    expect(component.isDraftLayout).toBe(false);
    expect(component.gridSettings.recordVisibility).toBe(
      RecordVisibility.submitted
    );
  });

  it('should disable actions until the first configured layout is loaded', () => {
    component.settings = {
      layouts: ['layout-id'],
      floatingButtons: [{ show: true }],
    };
    component.layout = null;

    expect(component.recordActionsDisabled).toBe(true);
    expect(component.gridActions).toEqual([]);
  });
});
