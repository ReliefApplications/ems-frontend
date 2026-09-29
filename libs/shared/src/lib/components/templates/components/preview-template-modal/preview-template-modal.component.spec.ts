import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { of, Subject } from 'rxjs';
import { EmailService } from '../../../email/email.service';
import { PreviewTemplateModalComponent } from './preview-template-modal.component';

// The modal only needs the module for its template, which is overridden below
jest.mock('../../../email/email.module', () => ({ EmailModule: class {} }));

describe('PreviewTemplateModalComponent', () => {
  let fixture: ComponentFixture<PreviewTemplateModalComponent>;
  let component: PreviewTemplateModalComponent;
  let emailServiceMock: any;
  let snackBarMock: { openSnackBar: jest.Mock };
  let dialogRefMock: { closed: Subject<any>; close: jest.Mock };

  const fb = new FormBuilder();

  /** Grid action query passed by the grid widget */
  const DATA_QUERY = {
    queryName: 'allRecords',
    fields: [{ name: 'name' }, { name: 'email' }],
    resource: 'res-1',
    filter: { logic: 'and', filters: [] },
  };

  /**
   * Builds the notification form the modal patches and reads.
   *
   * @returns Datasets form
   */
  const buildDatasetsForm = () =>
    fb.group({
      datasets: new FormArray([
        fb.group({
          name: [null],
          query: fb.group({
            name: [''],
            filter: fb.group({ logic: ['and'], filters: new FormArray([]) }),
            fields: new FormArray([]),
          }),
          resource: [null],
          individualEmail: [false],
          individualEmailFields: new FormArray([]),
          navigateToPage: [false],
          navigateSettings: [null],
        }),
      ]),
      emailDistributionList: fb.group({
        name: [''],
        to: fb.group({ inputEmails: new FormArray([]) }),
        cc: fb.group({ inputEmails: new FormArray([]) }),
        bcc: fb.group({ inputEmails: new FormArray([]) }),
      }),
      emailLayout: [null],
      attachments: fb.group({ files: [[]], sendAsAttachment: [null] }),
    });

  /**
   * Configures the test bed with the given dialog data and creates the modal.
   *
   * @param data Dialog data
   */
  const createComponent = async (data: any) => {
    await TestBed.configureTestingModule({
      imports: [
        PreviewTemplateModalComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: DIALOG_DATA, useValue: data },
        { provide: EmailService, useValue: emailServiceMock },
        { provide: SnackbarService, useValue: snackBarMock },
        { provide: DialogRef, useValue: dialogRefMock },
      ],
    })
      // Logic-only tests: the real template pulls in the whole email module
      .overrideComponent(PreviewTemplateModalComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PreviewTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    emailServiceMock = {
      isGridAction: false,
      gridActionDataQuery: undefined,
      gridActionSendSeparateEmail: undefined,
      disableNextActionBtn: false,
      distributionListSeparate: [],
      /** @returns whether a per-record recipient was found, as the real service computes it */
      get hasSeparateEmailRecipients() {
        return this.distributionListSeparate.some(
          (block: any) => block?.emails?.length > 0
        );
      },
      datasetsForm: buildDatasetsForm(),
      setDatasetForm: jest.fn(),
      quickEmailDistributionListQuery: [],
      showFileUpload: false,
      allPreviewData: [],
      emailDistributionList: undefined,
      layoutTitle: '',
      emailLayout: {},
      allLayoutdata: {},
      populateEmails: jest.fn(),
      sendQuickEmail: jest.fn(() => of({})),
      deleteFile: jest.fn(),
    };
    snackBarMock = { openSnackBar: jest.fn() };
    dialogRefMock = { closed: new Subject<any>(), close: jest.fn() };
  });

  describe('initialisation', () => {
    it('exposes the send separate email settings to the email steps', async () => {
      await createComponent({
        emailContent: { name: 'Template', subject: 'Hi' },
        dataQuery: DATA_QUERY,
        sendSeparateEmail: true,
        separateEmailFields: [{ name: 'email' }],
      });

      expect(emailServiceMock.isGridAction).toBe(true);
      expect(emailServiceMock.gridActionDataQuery).toBe(DATA_QUERY);
      expect(emailServiceMock.gridActionSendSeparateEmail).toBe(true);
      expect(emailServiceMock.allPreviewData).toHaveLength(1);
      expect(emailServiceMock.allPreviewData[0]).toMatchObject({
        tabName: 'Block 1',
        dataQuery: DATA_QUERY,
        sendSeparateEmail: true,
        separateEmailFields: [{ name: 'email' }],
      });
    });

    it('defaults to a single email when the grid action does not send separately', async () => {
      await createComponent({
        emailContent: { name: 'Template' },
        dataQuery: DATA_QUERY,
      });

      expect(emailServiceMock.gridActionSendSeparateEmail).toBe(false);
      expect(emailServiceMock.allPreviewData[0]).toMatchObject({
        sendSeparateEmail: false,
        separateEmailFields: [],
      });
    });
  });

  describe('next', () => {
    it('blocks with the To error when nothing can receive a single email', async () => {
      await createComponent({ emailContent: {}, dataQuery: DATA_QUERY });
      emailServiceMock.emailDistributionList = { to: [], cc: [], bcc: [] };

      component.next();

      expect(component.currentStep).toBe(0);
      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith(
        'common.notifications.email.errors.noRecipient',
        { error: true }
      );
    });

    it('blocks with the separate email error when no per-record recipient was found', async () => {
      await createComponent({
        emailContent: {},
        dataQuery: DATA_QUERY,
        sendSeparateEmail: true,
        separateEmailFields: [{ name: 'email' }],
      });
      emailServiceMock.emailDistributionList = { to: [], cc: [], bcc: [] };
      emailServiceMock.distributionListSeparate = [
        { name: 'Block 1', emails: [] },
      ];

      component.next();

      expect(component.currentStep).toBe(0);
      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith(
        'common.notifications.email.errors.noRecipientSeparateEmail',
        { error: true }
      );
    });

    it('proceeds on per-record recipients even without a To recipient', async () => {
      await createComponent({
        emailContent: {},
        dataQuery: DATA_QUERY,
        sendSeparateEmail: true,
        separateEmailFields: [{ name: 'email' }],
      });
      emailServiceMock.emailDistributionList = { to: [], cc: [], bcc: [] };
      emailServiceMock.distributionListSeparate = [
        { name: 'Block 1', emails: ['first@example.com'] },
      ];

      component.next();

      expect(component.currentStep).toBe(1);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    });

    it('proceeds on a To recipient when sending separately found nobody', async () => {
      await createComponent({
        emailContent: {},
        dataQuery: DATA_QUERY,
        sendSeparateEmail: true,
        separateEmailFields: [{ name: 'email' }],
      });
      emailServiceMock.emailDistributionList = {
        to: ['dl@example.com'],
        cc: [],
        bcc: [],
      };

      component.next();

      expect(component.currentStep).toBe(1);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    });

    it('proceeds on a To recipient for a single email', async () => {
      await createComponent({ emailContent: {}, dataQuery: DATA_QUERY });
      emailServiceMock.emailDistributionList = {
        to: ['dl@example.com'],
        cc: [],
        bcc: [],
      };

      component.next();

      expect(component.currentStep).toBe(1);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    });
  });

  describe('send', () => {
    /**
     * Prepares the state the preview step leaves behind before sending.
     */
    const prepareSendState = () => {
      emailServiceMock.emailDistributionList = {
        to: ['dl@example.com'],
        cc: [],
        bcc: [],
      };
      emailServiceMock.allPreviewData[0].emailDistributionList = {};
    };

    it('marks the dataset for individual emails with the recipient fields', async () => {
      await createComponent({
        emailContent: {},
        dataQuery: DATA_QUERY,
        sendSeparateEmail: true,
        separateEmailFields: [{ name: 'email' }],
      });
      prepareSendState();

      component.send();

      expect(emailServiceMock.sendQuickEmail).toHaveBeenCalledTimes(1);
      const payload = emailServiceMock.sendQuickEmail.mock.calls[0][0];
      expect(payload.datasets[0]).toMatchObject({
        name: 'Block 1',
        individualEmail: true,
        individualEmailFields: [{ name: 'email' }],
        query: {
          name: 'allRecords',
          fields: DATA_QUERY.fields,
          filter: DATA_QUERY.filter,
        },
      });
      expect(payload.emailDistributionList.to).toEqual({
        inputEmails: ['dl@example.com'],
      });
      expect(dialogRefMock.close).toHaveBeenCalledWith({
        preventDeletion: true,
      });
    });

    it('keeps the dataset as a single email when not sending separately', async () => {
      await createComponent({ emailContent: {}, dataQuery: DATA_QUERY });
      prepareSendState();

      component.send();

      const payload = emailServiceMock.sendQuickEmail.mock.calls[0][0];
      expect(payload.datasets[0].individualEmail).toBe(false);
      expect(payload.datasets[0].individualEmailFields).toEqual([]);
    });
  });
});
