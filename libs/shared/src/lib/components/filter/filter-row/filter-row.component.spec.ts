import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CommonServicesService } from '../../../services/common-services/common-services.service';
import { EmailService } from '../../email/email.service';
import { FilterRowComponent } from './filter-row.component';

/** Reference fields of the Common Services users filter */
const FIELDS = [
  {
    name: 'Country',
    editor: 'select',
    type: 'checkbox',
    isCommonService: true,
  },
  { name: 'firstname', editor: 'text', type: 'text', isCommonService: true },
];

/** Dataset token settings offered by a send-separate dataset */
const SETTINGS = {
  datasetBlocks: [
    { name: 'Block 1', fields: ['country', 'owner.email_address'] },
  ],
};

describe('FilterRowComponent', () => {
  let fixture: ComponentFixture<FilterRowComponent>;
  let component: FilterRowComponent;
  let csMock: { restRequest: jest.Mock };
  let emailServiceMock: any;

  /** Editor template stand-ins, so editor choices can be compared */
  const editors = {
    text: 'text-editor',
    select: 'select-editor',
    context: 'context-editor',
    datasetToken: 'dataset-token-editor',
  };

  /**
   * Builds a filter row form.
   *
   * @param value Initial value
   * @param field Initial field
   * @returns Filter row form
   */
  const buildForm = (value: any = null, field: string | null = null) =>
    new UntypedFormGroup({
      field: new UntypedFormControl(field),
      operator: new UntypedFormControl('eq'),
      value: new UntypedFormControl(value),
    });

  /**
   * Creates the component, runs its initialisation and installs the editor stand-ins.
   *
   * @param options Inputs
   * @param options.form Filter row form
   * @param options.settings Dataset token settings
   * @param options.fields Reference fields
   */
  const createComponent = (
    options: {
      form?: UntypedFormGroup;
      settings?: any;
      fields?: any[];
    } = {}
  ) => {
    fixture = TestBed.createComponent(FilterRowComponent);
    component = fixture.componentInstance;
    component.form = options.form ?? buildForm();
    component.fields = options.fields ?? FIELDS;
    component.datasetCommonServicesFieldSettings = options.settings;
    fixture.detectChanges();
    component.textEditor = editors.text as any;
    component.selectEditor = editors.select as any;
    component.contextEditor = editors.context as any;
    component.datasetTokenEditor = editors.datasetToken as any;
  };

  beforeEach(async () => {
    csMock = {
      restRequest: jest.fn(() =>
        of({ value: [{ Name: 'France' }, { Name: 'Chad' }] })
      ),
    };
    emailServiceMock = {
      userTableFields: ['firstname'],
      replaceUnderscores: (value: string) =>
        value ? value.replace(/[^a-zA-Z0-9-]/g, ' ') : '',
    };

    await TestBed.configureTestingModule({
      declarations: [FilterRowComponent],
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
        { provide: CommonServicesService, useValue: csMock },
      ],
    })
      // Logic-only tests: the editors are template refs compared by identity
      .overrideTemplate(FilterRowComponent, '')
      .compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('dataset token options', () => {
    it('offers one token per dataset field, labelled with the block name', () => {
      createComponent({ settings: SETTINGS });

      expect(component.datasetTokenOptions).toEqual([
        { value: '{{Block 1.country}}', label: 'Block 1 - country' },
        {
          value: '{{Block 1.owner.email_address}}',
          label: 'Block 1 - owner email address',
        },
      ]);
    });

    it('offers nothing without dataset blocks', () => {
      createComponent();
      expect(component.datasetTokenOptions).toEqual([]);

      createComponent({ settings: { datasetBlocks: [] } });
      expect(component.datasetTokenOptions).toEqual([]);
    });

    it('tracks options by their token value', () => {
      createComponent();
      expect(
        component.trackByTokenValue(3, { value: '{{Block 1.country}}' })
      ).toBe('{{Block 1.country}}');
    });

    it('recomputes the options when the settings change', () => {
      createComponent({ settings: SETTINGS });
      const next = { datasetBlocks: [{ name: 'Block 2', fields: ['id'] }] };
      component.datasetCommonServicesFieldSettings = next;

      component.ngOnChanges({
        datasetCommonServicesFieldSettings: new SimpleChange(
          SETTINGS,
          next,
          false
        ),
      });

      expect(component.datasetTokenOptions).toEqual([
        { value: '{{Block 2.id}}', label: 'Block 2 - id' },
      ]);
    });

    it('keeps the same options when the settings are equal', () => {
      createComponent({ settings: SETTINGS });
      const before = component.datasetTokenOptions;

      component.ngOnChanges({
        datasetCommonServicesFieldSettings: new SimpleChange(
          SETTINGS,
          { ...SETTINGS },
          false
        ),
      });

      expect(component.datasetTokenOptions).toBe(before);
    });
  });

  describe('toggleContextEditor', () => {
    it('switches to the dataset token editor when a dataset offers fields', () => {
      createComponent({
        form: buildForm('France', 'firstname'),
        settings: SETTINGS,
      });
      component.field = FIELDS[1];

      component.toggleContextEditor();

      expect(component.editor).toBe(editors.datasetToken);
      expect(component.contextEditorIsActivated).toBe(true);
      expect(component.form.get('value')?.value).toBeNull();
    });

    it('switches to the context editor when no dataset offers fields', () => {
      createComponent({ form: buildForm('France', 'firstname') });
      component.field = FIELDS[1];

      component.toggleContextEditor();

      expect(component.editor).toBe(editors.context);
      expect(component.contextEditorIsActivated).toBe(true);
    });

    it('returns to the field editor when toggled back', () => {
      createComponent({
        form: buildForm(null, 'firstname'),
        settings: SETTINGS,
      });
      component.field = FIELDS[1];
      component.toggleContextEditor();

      component.toggleContextEditor();

      expect(component.editor).toBe(editors.text);
      expect(component.contextEditorIsActivated).toBe(false);
    });
  });

  describe('saved dataset token', () => {
    it('restores the dataset token editor for a saved token', () => {
      createComponent({
        form: buildForm('{{Block 1.country}}', 'firstname'),
        settings: SETTINGS,
      });

      component.ngOnChanges({
        fields: new SimpleChange(undefined, FIELDS, true),
      });

      expect(component.editor).toBe(editors.datasetToken);
      expect(component.contextEditorIsActivated).toBe(true);
    });

    it('falls back to the field editor when no dataset offers fields', () => {
      createComponent({ form: buildForm('{{Block 1.country}}', 'firstname') });

      component.ngOnChanges({
        fields: new SimpleChange(undefined, FIELDS, true),
      });

      expect(component.editor).toBe(editors.text);
      expect(component.contextEditorIsActivated).toBe(false);
    });

    it('re-points an open token editor when only the settings change', () => {
      createComponent({
        form: buildForm('{{Block 1.country}}', 'firstname'),
        settings: SETTINGS,
      });
      component.ngOnChanges({
        fields: new SimpleChange(undefined, FIELDS, true),
      });
      component.editor = undefined as any;
      const next = { datasetBlocks: [{ name: 'Block 2', fields: ['id'] }] };
      component.datasetCommonServicesFieldSettings = next;

      component.ngOnChanges({
        datasetCommonServicesFieldSettings: new SimpleChange(
          SETTINGS,
          next,
          false
        ),
      });

      expect(component.editor).toBe(editors.datasetToken);
    });
  });

  describe('loadCommonServiceOptions', () => {
    it('loads the reference values of a select field', async () => {
      createComponent();
      const field: any = { ...FIELDS[0] };

      await component.loadCommonServiceOptions(field);

      expect(csMock.restRequest).toHaveBeenCalledWith('Country');
      expect(field.options).toEqual([
        { text: 'France', value: 'France' },
        { text: 'Chad', value: 'Chad' },
      ]);
      expect(component.loading).toBe(false);
    });

    it('skips user table fields, which are free text', async () => {
      createComponent();

      await component.loadCommonServiceOptions({ ...FIELDS[1] });

      expect(csMock.restRequest).not.toHaveBeenCalled();
    });

    it('logs and clears the loading flag when the lookup fails', async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      csMock.restRequest.mockReturnValue(throwError(() => new Error('down')));
      createComponent();
      const field: any = { ...FIELDS[0] };

      await component.loadCommonServiceOptions(field);

      expect(consoleError).toHaveBeenCalled();
      expect(field.options).toBeUndefined();
      expect(component.loading).toBe(false);
      consoleError.mockRestore();
    });

    it('preloads the values of a pre-selected select field before rendering it', async () => {
      createComponent({ form: buildForm('France', 'Country') });

      await component.ngAfterViewInit();

      expect(csMock.restRequest).toHaveBeenCalledWith('Country');
      expect(component.field.options).toHaveLength(2);
      expect(component.editor).toBe(editors.select);
    });
  });
});
