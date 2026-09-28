import { Dialog } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { WorkflowService } from '../../../../services/workflow/workflow.service';
import { EmailService } from '../../../email/email.service';
import { GridActionSettingsComponent } from './grid-action-settings.component';

// Lazily loaded by addEmailTemplate; the dialog itself is mocked
jest.mock(
  '../../../templates/components/template-modal/template-modal.component',
  () => ({ TemplateModalComponent: class {} })
);
// Only opened by addDistributionList; importing it drags in the whole email module
jest.mock(
  '../../../distribution-lists/components/distribution-modal/distribution-modal.component',
  () => ({ DistributionModalComponent: class {} })
);

describe('GridActionSettingsComponent', () => {
  let fixture: ComponentFixture<GridActionSettingsComponent>;
  let component: GridActionSettingsComponent;
  let emailServiceMock: any;
  let dialogMock: { open: jest.Mock };
  let dialogClosed$: Subject<any>;

  const fb = new FormBuilder();

  /**
   * Builds a query field form group, as the fields tab stores it.
   *
   * @param name Field name
   * @returns Field form group
   */
  const fieldGroup = (name: string) =>
    fb.group({ name: [{ value: name, disabled: true }], label: [name] });

  /**
   * Builds the subset of the grid action form the component reacts to.
   *
   * @param value Initial values
   * @param value.sendSeparateEmail Whether the action sends one email per record
   * @param value.separateEmailFields Names of the per-record recipient fields
   * @param value.bodyFields Names of the fields available to the email body
   * @returns Grid action form group
   */
  const buildActionForm = (value: {
    sendSeparateEmail?: boolean;
    separateEmailFields?: string[];
    bodyFields?: string[];
  }): FormGroup =>
    fb.group({
      show: [true],
      sendMail: [true],
      templates: [[]],
      distributionList: [null],
      sendSeparateEmail: [value.sendSeparateEmail ?? false],
      separateEmailFields: fb.array(
        (value.separateEmailFields ?? []).map(fieldGroup)
      ),
      bodyFields: fb.array((value.bodyFields ?? []).map(fieldGroup)),
      modifySelectedRows: [false],
      modifications: fb.array([]),
    });

  /**
   * Creates the component with the given grid action form.
   *
   * @param formGroup Grid action form group
   */
  const createComponent = (formGroup: FormGroup) => {
    fixture = TestBed.createComponent(GridActionSettingsComponent);
    component = fixture.componentInstance;
    component.formGroup = formGroup;
    component.widgetFormGroup = fb.group({
      actions: fb.group({ navigateToPage: [false] }),
    });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    dialogClosed$ = new Subject<any>();
    dialogMock = { open: jest.fn(() => ({ closed: dialogClosed$ })) };
    emailServiceMock = {
      showFileUpload: true,
      gridActionDataQuery: null,
      gridActionSendSeparateEmail: false,
      resetAllLayoutData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        GridActionSettingsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: Router, useValue: { url: '/applications/app/dashboard/1' } },
        { provide: WorkflowService, useValue: { workflow$: new Subject() } },
        { provide: Dialog, useValue: dialogMock },
        { provide: EmailService, useValue: emailServiceMock },
      ],
    })
      // Logic-only tests: the template pulls in the query builder & ui widgets
      .overrideComponent(GridActionSettingsComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  });

  it('should create', () => {
    createComponent(buildActionForm({}));
    expect(component).toBeTruthy();
  });

  describe('send separate email toggle', () => {
    it('exposes the per-record recipient fields array', () => {
      createComponent(
        buildActionForm({
          sendSeparateEmail: true,
          separateEmailFields: ['email'],
        })
      );

      expect(component.separateEmailFieldsArray).toBeInstanceOf(
        UntypedFormArray
      );
      expect(component.separateEmailFieldsArray.length).toBe(1);
    });

    it('drops the per-record recipient fields when switched off', () => {
      const form = buildActionForm({
        sendSeparateEmail: true,
        separateEmailFields: ['email', 'backup'],
      });
      createComponent(form);

      form.get('sendSeparateEmail')?.setValue(false);

      expect(component.separateEmailFieldsArray.length).toBe(0);
    });

    it('keeps the per-record recipient fields while switched on', () => {
      const form = buildActionForm({
        sendSeparateEmail: false,
        separateEmailFields: ['email'],
      });
      createComponent(form);

      form.get('sendSeparateEmail')?.setValue(true);

      expect(component.separateEmailFieldsArray.length).toBe(1);
    });
  });

  describe('addEmailTemplate', () => {
    it('shares the body fields and the send separate flag before opening the template modal', async () => {
      createComponent(
        buildActionForm({
          sendSeparateEmail: true,
          bodyFields: ['name', 'email'],
        })
      );

      await component.addEmailTemplate();

      expect(emailServiceMock.resetAllLayoutData).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.showFileUpload).toBe(false);
      expect(emailServiceMock.gridActionDataQuery).toEqual({
        queryName: '',
        fields: [
          { name: 'name', label: 'name' },
          { name: 'email', label: 'email' },
        ],
      });
      expect(emailServiceMock.gridActionSendSeparateEmail).toBe(true);
      expect(dialogMock.open).toHaveBeenCalledTimes(1);
    });

    it('does not flag send separate email for a regular grid action', async () => {
      createComponent(buildActionForm({ bodyFields: ['name'] }));

      await component.addEmailTemplate();

      expect(emailServiceMock.gridActionSendSeparateEmail).toBe(false);
    });

    it('clears the shared state and selects the new template once the modal closes', async () => {
      const form = buildActionForm({
        sendSeparateEmail: true,
        bodyFields: ['name'],
      });
      createComponent(form);
      component.templates = [{ id: 'old', type: 'email' }];
      await component.addEmailTemplate();

      dialogClosed$.next({
        result: {
          data: { addCustomTemplate: { id: 'new', type: 'email' } },
        },
      });

      expect(emailServiceMock.gridActionDataQuery).toBeNull();
      expect(emailServiceMock.gridActionSendSeparateEmail).toBe(false);
      expect(component.templates.map((template) => template.id)).toEqual([
        'new',
        'old',
      ]);
      expect(form.get('templates')?.value).toBe('new');
    });

    it('clears the shared state even when the modal is dismissed', async () => {
      const form = buildActionForm({
        sendSeparateEmail: true,
        bodyFields: ['name'],
      });
      createComponent(form);
      component.templates = [{ id: 'old', type: 'email' }];
      await component.addEmailTemplate();

      dialogClosed$.next(undefined);

      expect(emailServiceMock.gridActionDataQuery).toBeNull();
      expect(emailServiceMock.gridActionSendSeparateEmail).toBe(false);
      expect(component.templates.map((template) => template.id)).toEqual([
        'old',
      ]);
      expect(form.get('templates')?.value).toEqual([]);
    });
  });
});
