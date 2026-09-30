import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';
import { ApplicationService } from '../../../../../index';
import { GridService } from '../../../../services/grid/grid.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { RestService } from '../../../../services/rest/rest.service';
import { EmailService } from '../../email.service';
import { DatasetFilterComponent } from './dataset-filter.component';

// The component only needs the application service token from the library
// barrel; importing the real barrel drags in every widget of the library.
jest.mock('../../../../../index', () => ({
  ApplicationService: class {},
  ContentType: { form: 'form', workflow: 'workflow', dashboard: 'dashboard' },
}));

describe('DatasetFilterComponent', () => {
  let fixture: ComponentFixture<DatasetFilterComponent>;
  let component: DatasetFilterComponent;
  let emailServiceMock: any;

  /**
   * Builds the dataset form group the component edits.
   *
   * @param options Dataset values
   * @param options.name Dataset name
   * @param options.fields Selected query fields
   * @param options.individualEmail Whether the dataset sends separately
   * @param options.individualEmailFields Selected recipient fields
   * @param options.csFilters Common Services filter rows
   * @returns Dataset form group
   */
  const buildQuery = (
    options: {
      name?: string | null;
      fields?: any[];
      individualEmail?: boolean;
      individualEmailFields?: any[];
      csFilters?: any[];
    } = {}
  ) =>
    new FormGroup({
      name: new FormControl(
        options.name === undefined ? 'Block 1' : options.name
      ),
      resource: new FormControl('res-1'),
      query: new FormGroup({
        name: new FormControl('allRecords'),
        fields: new FormArray(
          (options.fields ?? []).map((field) => new FormControl(field))
        ),
      }),
      individualEmail: new FormControl(options.individualEmail ?? false),
      individualEmailFields: new FormArray(
        (options.individualEmailFields ?? []).map(
          (field) => new FormControl(field)
        )
      ),
      csFilter: new FormGroup({
        logic: new FormControl('and'),
        filters: new FormArray(
          (options.csFilters ?? []).map((filter) => new FormControl(filter))
        ),
      }),
    });

  beforeEach(async () => {
    emailServiceMock = {
      computedCommonServiceFields: [],
      allAvailableDatasetFields: [],
      appendFields: EmailService.prototype.appendFields,
      disableSaveAndProceed: new BehaviorSubject<boolean>(false),
      disableSaveAsDraft: new BehaviorSubject<boolean>(false),
      buildCommonServiceFields: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DatasetFilterComponent],
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
        { provide: EmailService, useValue: emailServiceMock },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
        { provide: QueryBuilderService, useValue: {} },
        { provide: GridService, useValue: {} },
        { provide: RestService, useValue: { apiUrl: '' } },
        {
          provide: ApplicationService,
          useValue: { application: new BehaviorSubject(null) },
        },
      ],
    })
      // Logic-only tests: the template renders the whole dataset editor
      .overrideTemplate(DatasetFilterComponent, '')
      .compileComponents();

    // ngOnInit loads the resource from the API, which these tests do not exercise
    fixture = TestBed.createComponent(DatasetFilterComponent);
    component = fixture.componentInstance;
    component.query = buildQuery();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the Common Services reference fields built by the service', () => {
    emailServiceMock.computedCommonServiceFields = [{ name: 'Country' }];

    expect(component.csFilterReferenceFields).toEqual([{ name: 'Country' }]);
  });

  describe('dataset token settings for the Common Services filter', () => {
    /**
     * Recomputes the settings from the current dataset form.
     *
     * @returns Settings bound to the filter builder
     */
    const compute = () => {
      (component as any).computeDatasetCommonServicesFieldSettings();
      return component.datasetCommonServicesFieldSettings;
    };

    it('offers the selected fields of the dataset, flattening nested ones', () => {
      component.query = buildQuery({
        name: 'Cases',
        fields: [
          { name: 'country' },
          { name: 'owner', fields: [{ name: 'email' }, { name: 'name' }] },
        ],
      });

      expect(compute()).toEqual({
        datasetBlocks: [
          { name: 'Cases', fields: ['country', 'owner.email', 'owner.name'] },
        ],
      });
    });

    it('offers nothing while the dataset has no name', () => {
      component.query = buildQuery({ name: null, fields: [{ name: 'a' }] });

      expect(compute()).toEqual({});
    });

    it('offers nothing while the dataset has no selected field', () => {
      component.query = buildQuery({ name: 'Cases', fields: [] });

      expect(compute()).toEqual({});
    });
  });

  describe('send-separate recipient source gate', () => {
    beforeEach(() => {
      component.availableFieldsIndividualEmail = [];
    });

    it('blocks proceeding when a send-separate dataset has no recipient source', () => {
      component.query = buildQuery({ individualEmail: true });
      const next = jest.spyOn(emailServiceMock.disableSaveAndProceed, 'next');

      component.getIndividualEmailFieldsArray();

      expect(next).toHaveBeenCalledWith(true);
      expect(component.showFieldsWarning_SSE).toBe(true);
    });

    it('accepts a Common Services filter as the recipient source', () => {
      component.query = buildQuery({
        individualEmail: true,
        csFilters: [{ field: 'country', operator: 'eq', value: 'x' }],
      });
      const next = jest.spyOn(emailServiceMock.disableSaveAndProceed, 'next');

      component.getIndividualEmailFieldsArray();

      expect(next).not.toHaveBeenCalledWith(true);
      expect(component.showFieldsWarning_SSE).toBe(false);
    });

    it('accepts recipient fields as the recipient source', () => {
      component.query = buildQuery({
        individualEmail: true,
        individualEmailFields: [{ name: 'email', label: 'Email' }],
      });
      const next = jest.spyOn(emailServiceMock.disableSaveAndProceed, 'next');

      component.getIndividualEmailFieldsArray();

      expect(next).toHaveBeenCalledWith(false);
      expect(component.showFieldsWarning_SSE).toBe(false);
    });

    it('does not gate a dataset that is not sent separately', () => {
      component.query = buildQuery({ individualEmail: false });
      const next = jest.spyOn(emailServiceMock.disableSaveAndProceed, 'next');

      component.getIndividualEmailFieldsArray();

      expect(next).not.toHaveBeenCalled();
    });
  });
});
