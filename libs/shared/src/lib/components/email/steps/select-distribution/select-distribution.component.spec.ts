import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { of } from 'rxjs';
import { ApplicationService } from '../../../../services/application/application.service';
import { DownloadService } from '../../../../services/download/download.service';
import { RestService } from '../../../../services/rest/rest.service';
import { EmailService } from '../../email.service';
import { SelectDistributionComponent } from './select-distribution.component';

describe('SelectDistributionComponent', () => {
  let fixture: ComponentFixture<SelectDistributionComponent>;
  let component: SelectDistributionComponent;
  let emailServiceMock: any;

  /**
   * Builds a recipient group of the distribution list form.
   *
   * @returns Recipient form group
   */
  const recipientGroup = () =>
    new FormGroup({
      resource: new FormControl(''),
      query: new FormGroup({ name: new FormControl('') }),
      inputEmails: new FormArray([]),
    });

  /**
   * Seeds the datasets of the notification form.
   *
   * @param datasets Dataset values
   */
  const seedDatasets = (datasets: any[]) => {
    emailServiceMock.datasetsForm.setControl(
      'datasets',
      new FormArray(datasets.map((dataset) => new FormControl(dataset)))
    );
  };

  /**
   * A dataset backed by a resource.
   *
   * @param overrides Dataset overrides
   * @returns Dataset value
   */
  const dataset = (overrides: Record<string, any> = {}) => ({
    name: 'Block',
    resource: 'res-1',
    reference: null,
    individualEmail: false,
    individualEmailFields: [],
    csFilter: { logic: 'and', filters: [] },
    individualEmailToDistributionList: false,
    ...overrides,
  });

  /**
   * A send-separate dataset addressed through its email fields.
   *
   * @param overrides Dataset overrides
   * @returns Dataset value
   */
  const separate = (overrides: Record<string, any> = {}) =>
    dataset({
      individualEmail: true,
      individualEmailFields: [{ name: 'email' }],
      ...overrides,
    });

  beforeEach(async () => {
    emailServiceMock = {
      showExistingDistributionList: false,
      distributionListNames: [],
      cacheDistributionList: [],
      selectedDistributionListName: 'Kept',
      isDistributionListOptional: false,
      isAllSeparateEmail: false,
      datasetsForm: new FormGroup({
        applicationId: new FormControl(''),
        datasets: new FormArray([]),
      }),
      distributionListData: new FormGroup({
        name: new FormControl('My list'),
        to: recipientGroup(),
        cc: recipientGroup(),
        bcc: recipientGroup(),
      }),
      getEmailDistributionList: jest.fn(() =>
        of({ data: { emailDistributionLists: { edges: [] } } })
      ),
      clearDistributionList: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SelectDistributionComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        FormBuilder,
        { provide: EmailService, useValue: emailServiceMock },
        { provide: ApplicationService, useValue: { application$: of(null) } },
        { provide: DownloadService, useValue: {} },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
        { provide: RestService, useValue: { apiUrl: '' } },
      ],
    })
      // Logic-only tests: the template renders the distribution list editor
      .overrideTemplate(SelectDistributionComponent, '')
      .compileComponents();

    // ngOnInit binds the recipient editors, which these tests do not exercise
    fixture = TestBed.createComponent(SelectDistributionComponent);
    component = fixture.componentInstance;
    component.distributionListId = 'dl-1';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isAllSeparate', () => {
    it('keeps the distribution list required when no dataset sends separately', () => {
      seedDatasets([dataset(), dataset({ name: 'Other' })]);

      expect(component.isAllSeparate()).toBe(false);
      expect(emailServiceMock.isDistributionListOptional).toBe(false);
      expect(emailServiceMock.isAllSeparateEmail).toBe(false);
      expect(emailServiceMock.clearDistributionList).not.toHaveBeenCalled();
      expect(emailServiceMock.distributionListData.get('name')?.value).toBe(
        'My list'
      );
    });

    it('makes the distribution list optional once one dataset sends separately', () => {
      seedDatasets([dataset(), separate({ name: 'Separate' })]);

      expect(component.isAllSeparate()).toBe(false);
      expect(emailServiceMock.isDistributionListOptional).toBe(true);
      expect(emailServiceMock.isAllSeparateEmail).toBe(false);
      expect(emailServiceMock.clearDistributionList).not.toHaveBeenCalled();
    });

    it('clears the distribution list when every dataset sends separately to its own recipients', () => {
      seedDatasets([separate(), separate({ name: 'Other' })]);

      expect(component.isAllSeparate()).toBe(true);
      expect(emailServiceMock.isDistributionListOptional).toBe(true);
      expect(emailServiceMock.isAllSeparateEmail).toBe(true);
      expect(emailServiceMock.distributionListData.get('name')?.value).toBe('');
      expect(emailServiceMock.clearDistributionList).toHaveBeenCalledTimes(3);
      expect(emailServiceMock.clearDistributionList).toHaveBeenCalledWith(
        emailServiceMock.distributionListData.get('to')
      );
      expect(emailServiceMock.selectedDistributionListName).toBe('');
      expect(component.distributionListId).toBe('');
    });

    it('keeps the distribution list when a send-separate dataset also delivers to it', () => {
      seedDatasets([
        separate(),
        separate({ name: 'Other', individualEmailToDistributionList: true }),
      ]);

      expect(component.isAllSeparate()).toBe(false);
      expect(emailServiceMock.isDistributionListOptional).toBe(true);
      expect(emailServiceMock.isAllSeparateEmail).toBe(false);
      expect(emailServiceMock.clearDistributionList).not.toHaveBeenCalled();
      expect(component.distributionListId).toBe('dl-1');
    });

    it('counts a Common Services users filter as a recipient source', () => {
      seedDatasets([
        dataset({
          individualEmail: true,
          individualEmailFields: [],
          csFilter: {
            logic: 'and',
            filters: [{ field: 'country', operator: 'eq', value: 'x' }],
          },
        }),
      ]);

      expect(component.isAllSeparate()).toBe(true);
      expect(emailServiceMock.isDistributionListOptional).toBe(true);
    });

    it('ignores a send-separate dataset that has no recipient source yet', () => {
      seedDatasets([
        dataset({ individualEmail: true, individualEmailFields: [] }),
      ]);

      expect(component.isAllSeparate()).toBe(false);
      expect(emailServiceMock.isDistributionListOptional).toBe(false);
      expect(emailServiceMock.clearDistributionList).not.toHaveBeenCalled();
    });

    it('ignores datasets that have no resource or reference', () => {
      seedDatasets([
        separate({ resource: null, reference: null }),
        dataset({ resource: null, reference: null }),
      ]);

      expect(component.isAllSeparate()).toBe(false);
      expect(emailServiceMock.isDistributionListOptional).toBe(false);
    });

    it('accepts reference-backed datasets', () => {
      seedDatasets([separate({ resource: null, reference: 'ref-1' })]);

      expect(component.isAllSeparate()).toBe(true);
    });
  });
});
