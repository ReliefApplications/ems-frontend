import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { CoreGridComponent } from './core-grid.component';
import { UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from '../../../services/query-builder/graphql/queries';
import { Ability } from '@casl/ability';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

describe('CoreGridComponent', () => {
  let component: CoreGridComponent;
  let fixture: ComponentFixture<CoreGridComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        UntypedFormBuilder,
        QueryBuilderService,
        TranslateService,
        {
          provide: Ability,
          useValue: { can: jest.fn(), cannot: jest.fn() },
        },
      ],
      declarations: [CoreGridComponent],
      imports: [
        HttpClientModule,
        DialogCdkModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
      ],
    })
      .overrideComponent(CoreGridComponent, { set: { template: '' } })
      .compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreGridComponent);
    component = fixture.componentInstance;
    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
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

  it('should disable every record action for a draft layout', () => {
    component.settings = {
      template: 'template-id',
      actions: {
        addRecord: true,
        update: true,
        delete: true,
        history: true,
        convert: true,
        export: true,
        import: true,
        showDetails: true,
        navigateToPage: true,
        remove: true,
        inlineEdition: true,
      },
    };
    component.actionsDisabled = true;

    component.configureGrid();

    expect(component.actions).toEqual(
      expect.objectContaining({
        add: false,
        update: false,
        delete: false,
        history: false,
        convert: false,
        export: false,
        import: false,
        showDetails: true,
        navigateToPage: false,
        remove: false,
      })
    );
    expect(component.editable).toBe(false);
  });

  it('should allow details while other draft-layout actions are disabled', () => {
    component.actionsDisabled = true;
    const detailsSpy = jest
      .spyOn(component, 'onShowDetails')
      .mockResolvedValue();
    const updateSpy = jest.spyOn(component, 'onUpdate').mockResolvedValue();
    const resetSpy = jest.spyOn(component, 'resetDefaultLayout');

    component.onAction({ action: 'details', items: [{ id: 'draft-id' }] });
    component.onAction({ action: 'update', item: { id: 'draft-id' } });
    component.onAction({ action: 'resetLayout' });

    expect(detailsSpy).toHaveBeenCalledWith([{ id: 'draft-id' }], undefined);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });
});
