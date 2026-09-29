import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { GridWidgetComponent } from './grid.component';
import { WorkflowService } from '../../../services/workflow/workflow.service';
import { EmailService } from '../../../services/email/email.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { GridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { ApplicationService } from '../../../services/application/application.service';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

describe('GridWidgetComponent', () => {
  let component: GridWidgetComponent;
  let fixture: ComponentFixture<GridWidgetComponent>;
  const dialog = { open: jest.fn() };
  const emailService = {
    getCustomTemplates: jest.fn(),
    getEmailDistributionList: jest.fn(),
    previewCustomTemplate: jest.fn(),
  };
  const queryBuilder = {
    graphqlQuery: jest.fn(),
    buildQuery: jest.fn(),
  };
  const dashboardService = { triggerReloadWidgets: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    await TestBed.configureTestingModule({
      declarations: [GridWidgetComponent],
      imports: [
        ApolloTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: Dialog, useValue: dialog },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
        { provide: WorkflowService, useValue: {} },
        { provide: EmailService, useValue: emailService },
        { provide: QueryBuilderService, useValue: queryBuilder },
        { provide: GridLayoutService, useValue: {} },
        { provide: ConfirmService, useValue: {} },
        { provide: ApplicationService, useValue: {} },
        { provide: AggregationService, useValue: {} },
        { provide: DashboardService, useValue: dashboardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridWidgetComponent);
    component = fixture.componentInstance;
    component.settings = { resource: 'resource-1' };
    component.layout = { query: { name: 'records' } };
    component.widget = { settings: { actions: {} } };
    Object.defineProperty(component, 'grid', {
      value: {
        selectedRows: ['record-1'],
        skip: 0,
        sortField: null,
        sortOrder: null,
        reloadData: jest.fn(),
      },
    });
    queryBuilder.buildQuery.mockReturnValue({});
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends separate emails without fetching a distribution list', async () => {
    const separateEmailFields = [{ name: 'email' }];
    const template = { id: 'template-1' };
    emailService.getCustomTemplates.mockReturnValue(
      of({ data: { customTemplates: { edges: [{ node: template }] } } })
    );
    dialog.open.mockReturnValue({
      closed: of({ template: 'template-1' }),
    });
    const previewOpened = new Promise<void>((resolve) => {
      emailService.previewCustomTemplate.mockImplementation(() => resolve());
    });

    await component.onGridAction({
      sendMail: true,
      templates: ['template-1'],
      bodyFields: [{ name: 'name' }],
      sendSeparateEmail: true,
      separateEmailFields,
    });
    await previewOpened;

    expect(emailService.getCustomTemplates).toHaveBeenCalledWith([
      'template-1',
    ]);
    expect(emailService.getEmailDistributionList).not.toHaveBeenCalled();
    expect(emailService.previewCustomTemplate).toHaveBeenCalledWith(
      template,
      undefined,
      undefined,
      expect.any(Object),
      true,
      separateEmailFields
    );
  });

  it('fetches only the configured distribution list', async () => {
    const template = { id: 'template-1' };
    const distributionList = { id: 'distribution-list-1' };
    emailService.getCustomTemplates.mockReturnValue(
      of({ data: { customTemplates: { edges: [{ node: template }] } } })
    );
    emailService.getEmailDistributionList.mockReturnValue(
      of({
        data: {
          emailDistributionLists: {
            edges: [{ node: distributionList }],
          },
        },
      })
    );
    dialog.open.mockReturnValue({ closed: of(undefined) });
    const dialogOpened = new Promise<void>((resolve) => {
      dialog.open.mockImplementation(() => {
        resolve();
        return { closed: of(undefined) };
      });
    });

    await component.onGridAction({
      sendMail: true,
      templates: ['template-1'],
      distributionList: 'distribution-list-1',
    });
    await dialogOpened;

    expect(emailService.getEmailDistributionList).toHaveBeenCalledTimes(1);
    expect(emailService.getEmailDistributionList).toHaveBeenCalledWith(
      'distribution-list-1'
    );
  });
});
