import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { BehaviorSubject, Subject, Subscription, of } from 'rxjs';
import { ApplicationService } from '../../../../services/application/application.service';
import { EmailService } from '../../email.service';
import { EmsTemplateComponent } from './ems-template.component';

describe('EmsTemplateComponent', () => {
  let fixture: ComponentFixture<EmsTemplateComponent>;
  let component: EmsTemplateComponent;
  let emailServiceMock: any;

  /** A Common Services filter as the dataset editor stores it */
  const CS_FILTER = {
    logic: 'and',
    filters: [
      { field: 'Country', operator: 'eq', value: '{{Block 1.country}}' },
    ],
  };

  /**
   * Builds the payload the wizard saves.
   *
   * @param overrides Payload overrides
   * @returns Notification payload
   */
  const buildPayload = (overrides: Record<string, any> = {}) => ({
    applicationId: 'app-1',
    datasets: [
      {
        name: 'Block 1',
        resource: 'res-1',
        individualEmail: true,
        individualEmailFields: [{ name: 'email' }],
        csFilter: CS_FILTER,
        query: { name: 'allRecords', fields: [], filter: {} },
      },
    ],
    emailDistributionList: null,
    ...overrides,
  });

  /**
   * An existing distribution list, referenced by id.
   *
   * @returns Distribution list value
   */
  const existingDistributionList = () => ({
    id: 'dl-1',
    name: 'My list',
    to: { commonServiceFilter: { filter: { logic: 'and', filters: [] } } },
    cc: { commonServiceFilter: { filter: { logic: 'and', filters: [] } } },
    bcc: { commonServiceFilter: { filter: { logic: 'and', filters: [] } } },
  });

  beforeEach(async () => {
    emailServiceMock = {
      setCommonServicePayload: jest.fn((filter: any) => ({
        mapped: true,
        ...filter,
      })),
      editDistributionList: jest.fn(() => of({})),
      addDistributionList: jest.fn(() =>
        of({ data: { addEmailDistributionList: { id: 'dl-new' } } })
      ),
      datasetsForm: new FormGroup({
        name: new FormControl('Notification'),
        emailLayout: new FormControl({ name: 'Layout' }),
        emailDistributionList: new FormGroup({ id: new FormControl('') }),
      }),
      // Stepper state subscribed to by the constructor
      isEdit: false,
      disableSaveAndProceed: new BehaviorSubject<boolean>(false),
      disableFormSteps: new Subject<any>(),
      enableAllSteps: new Subject<boolean>(),
      datasetSave: new EventEmitter<boolean>(),
      loading: false,
    };

    await TestBed.configureTestingModule({
      declarations: [EmsTemplateComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: EmailService, useValue: emailServiceMock },
        { provide: ApplicationService, useValue: {} },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
      ],
    })
      // Logic-only tests: the template hosts the whole notification wizard
      .overrideTemplate(EmsTemplateComponent, '')
      .compileComponents();

    // ngOnInit wires the stepper to the service, which these tests do not
    // exercise; give the destroy hook the subscriptions it expects instead.
    fixture = TestBed.createComponent(EmsTemplateComponent);
    component = fixture.componentInstance;
    (component as any).disableSub = new Subscription();
    (component as any).disableDraft = new Subscription();
    (component as any).disableSend = new Subscription();
    jest
      .spyOn(component as any, 'addEditCustomTemplate')
      .mockResolvedValue({ id: 'layout-1' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('releases the dataset step when validation cannot be completed', async () => {
    const snackBar = TestBed.inject(SnackbarService);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    emailServiceMock.checkDatasetsValid = jest
      .fn()
      .mockRejectedValue(new Error('Validation unavailable'));
    emailServiceMock.disableSaveAndProceed.next(true);
    component.currentStep = 1;

    await component.next();

    expect(emailServiceMock.loading).toBe(false);
    expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
    expect(snackBar.openSnackBar).toHaveBeenCalledWith(
      'common.notifications.dataNotRecovered',
      { error: true }
    );
  });

  it('keeps the dataset step blocked when validation finds invalid data', async () => {
    emailServiceMock.checkDatasetsValid = jest.fn().mockResolvedValue({
      valid: false,
      badData: ['Block 1'],
    });
    component.currentStep = 1;

    await component.next();

    expect(component.currentStep).toBe(1);
    expect(emailServiceMock.loading).toBe(false);
    expect(emailServiceMock.disableSaveAndProceed.value).toBe(true);
  });

  it('runs only one dataset validation while Next is clicked repeatedly', async () => {
    let resolveValidation!: (result: {
      valid: boolean;
      badData: string[];
    }) => void;
    emailServiceMock.checkDatasetsValid = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveValidation = resolve;
        })
    );
    component.currentStep = 1;

    const firstNavigation = component.next();
    await component.next();
    resolveValidation({ valid: true, badData: [] });
    await firstNavigation;

    expect(emailServiceMock.checkDatasetsValid).toHaveBeenCalledTimes(1);
    expect(component.currentStep).toBe(2);
    expect(emailServiceMock.loading).toBe(false);
    expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
  });

  describe('getDataSetToSkipOptions', () => {
    it('maps the Common Services filter of each send-separate dataset for the API', async () => {
      const payload = buildPayload();

      const result = await component.getDataSetToSkipOptions(payload);

      expect(emailServiceMock.setCommonServicePayload).toHaveBeenCalledWith(
        CS_FILTER
      );
      expect(result.datasets[0].csFilter).toEqual({
        mapped: true,
        ...CS_FILTER,
      });
      // The stored form value must not be mutated by the mapping
      expect(CS_FILTER.filters[0].field).toBe('Country');
    });

    it('drops an empty Common Services filter', async () => {
      const payload = buildPayload({
        datasets: [
          {
            name: 'Block 1',
            resource: 'res-1',
            individualEmail: true,
            csFilter: { logic: 'and', filters: [] },
            query: { name: 'allRecords', fields: [], filter: {} },
          },
          {
            name: 'Block 2',
            resource: 'res-2',
            individualEmail: false,
            query: { name: 'allRecords', fields: [], filter: {} },
          },
        ],
      });

      const result = await component.getDataSetToSkipOptions(payload);

      expect(result.datasets.map((dataset: any) => dataset.csFilter)).toEqual([
        null,
        null,
      ]);
      expect(emailServiceMock.setCommonServicePayload).not.toHaveBeenCalled();
    });

    it('updates an existing distribution list in place, even when every dataset sends separately', async () => {
      const payload = buildPayload({
        emailDistributionList: existingDistributionList(),
      });

      const result = await component.getDataSetToSkipOptions(payload);

      expect(emailServiceMock.editDistributionList).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.editDistributionList.mock.calls[0][1]).toBe(
        'dl-1'
      );
      expect(emailServiceMock.addDistributionList).not.toHaveBeenCalled();
      expect(result.emailDistributionList).toBe('dl-1');
      expect(result.emailLayout).toBe('layout-1');
    });

    it('saves without a distribution list when none is configured', async () => {
      const result = await component.getDataSetToSkipOptions(buildPayload());

      expect(emailServiceMock.editDistributionList).not.toHaveBeenCalled();
      expect(emailServiceMock.addDistributionList).not.toHaveBeenCalled();
      expect(result.emailDistributionList).toBeNull();
    });
  });
});
