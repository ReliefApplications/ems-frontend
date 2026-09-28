import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { BehaviorSubject, Subject } from 'rxjs';
import { EditorService } from '../../../../services/editor/editor.service';
import { EmailService } from '../../email.service';
import { LayoutComponent } from './layout.component';

/** Fields exposed by the first dataset block */
const FIRST_BLOCK_FIELDS = ['name', 'contact.email'];

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;
  let emailServiceMock: any;
  let snackBarMock: { openSnackBar: jest.Mock };

  /**
   * Builds a minimal dataset block form group as the layout step expects it.
   *
   * @param name Block name
   * @param fields Query fields of the block
   * @returns Dataset block form group
   */
  const buildBlock = (name: string, fields: string[]): FormGroup =>
    new FormGroup({
      name: new FormControl(name),
      query: new FormGroup({
        name: new FormControl('query'),
        filter: new FormGroup({ filters: new FormArray([]) }),
        fields: new FormArray(
          fields.map((field) => new FormControl({ name: field }))
        ),
      }),
    });

  /**
   * Creates the component and runs its initialisation.
   *
   * @param beforeInit Optional hook run before the first change detection
   */
  const createComponent = (beforeInit?: () => void) => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    // Colour inputs read on destroy live in the (overridden) template
    jest.spyOn(component, 'getColors').mockReturnValue({} as any);
    beforeInit?.();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    emailServiceMock = {
      isGridAction: false,
      isCustomTemplateEdit: false,
      isNewCustomTemplate: false,
      showFileUpload: false,
      layoutTitle: '',
      customTemplateNames: [],
      emailLayout: { name: 'My layout' },
      allLayoutdata: { txtSubject: '', headerHtml: '', bodyHtml: '' },
      previewData: {
        datasets: ['Block 1', 'Block 2'],
        fields: [...FIRST_BLOCK_FIELDS],
      },
      sendSeparateBlocks: [],
      gridActionSendSeparateEmail: false,
      gridActionDataQuery: null,
      // Real flattening logic, so nested tokens are exercised
      appendFields: EmailService.prototype.appendFields,
      datasetsForm: new FormGroup({
        datasets: new FormArray([
          buildBlock('Block 1', FIRST_BLOCK_FIELDS),
          buildBlock('Block 2', ['other']),
        ]),
      }),
      disableSaveAndProceed: new BehaviorSubject<boolean>(false),
      stepperDisable: new Subject<any>(),
      createPreviewData: jest.fn(),
      resetPreviewData: jest.fn(),
      getAllPreviewData: jest.fn(() => []),
      loadLayoutDistributionList: jest.fn(),
      populateEmails: jest.fn(),
    };
    snackBarMock = { openSnackBar: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
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
        { provide: EditorService, useValue: { url: '', language: 'en' } },
        { provide: SnackbarService, useValue: snackBarMock },
      ],
    })
      // Logic-only tests: the template pulls in tinymce & ui widgets
      .overrideTemplate(LayoutComponent, '')
      .compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('layout form', () => {
    it('exposes an empty bodyFieldSelect control when building a layout', () => {
      createComponent();
      expect(component.layoutForm.get('bodyFieldSelect')?.value).toBe('');
    });

    it('exposes an empty bodyFieldSelect control when editing a custom template', () => {
      emailServiceMock.isCustomTemplateEdit = true;
      emailServiceMock.datasetsForm.addControl(
        'emailLayout',
        new FormControl({
          subject: 'Subject',
          header: { headerHtml: '<p>h</p>' },
          body: { bodyHtml: '<p>b</p>' },
        })
      );
      createComponent();
      expect(component.layoutForm.get('bodyFieldSelect')?.value).toBe('');
      expect(component.layoutForm.get('body')?.value).toBe('<p>b</p>');
    });
  });

  describe('body field select options', () => {
    it("lists each send-separate block's own fields", () => {
      emailServiceMock.sendSeparateBlocks = ['Block 1', 'Block 2'];
      createComponent();
      expect(component.firstBlockFields).toEqual(FIRST_BLOCK_FIELDS);
      expect(component.blockFieldSelect).toEqual([
        'Block 1 - name',
        'Block 1 - contact.email',
        'Block 2 - other',
      ]);
    });

    it('only lists blocks flagged as send-separate', () => {
      emailServiceMock.sendSeparateBlocks = ['Block 2'];
      createComponent();
      expect(component.blockFieldSelect).toEqual(['Block 2 - other']);
    });

    it('flattens nested fields of a send-separate block', () => {
      emailServiceMock.sendSeparateBlocks = ['Block 2'];
      emailServiceMock.datasetsForm = new FormGroup({
        datasets: new FormArray([
          buildBlock('Block 1', FIRST_BLOCK_FIELDS),
          new FormGroup({
            name: new FormControl('Block 2'),
            query: new FormGroup({
              name: new FormControl('query'),
              filter: new FormGroup({ filters: new FormArray([]) }),
              fields: new FormArray([
                new FormControl({
                  name: 'owner',
                  fields: [{ name: 'name' }, { name: 'email' }],
                }),
              ]),
            }),
          }),
        ]),
      });
      createComponent();
      expect(component.blockFieldSelect).toEqual([
        'Block 2 - owner.name',
        'Block 2 - owner.email',
      ]);
    });

    it('is empty when no block is sent separately', () => {
      createComponent();
      expect(component.blockData).toEqual(['Block 1', 'Block 2']);
      expect(component.blockFieldSelect).toEqual([]);
    });

    it('is empty when the first block has no fields', () => {
      emailServiceMock.sendSeparateBlocks = ['Block 1'];
      emailServiceMock.datasetsForm = new FormGroup({
        datasets: new FormArray([buildBlock('Block 1', [])]),
      });
      createComponent();
      expect(component.blockData).toEqual([]);
      expect(component.blockFieldSelect).toEqual([]);
    });

    it('refreshes when block data is recomputed', () => {
      createComponent();
      expect(component.blockFieldSelect).toEqual([]);

      emailServiceMock.sendSeparateBlocks = ['Block 1'];
      component.getBlockData();
      expect(component.blockFieldSelect).toEqual([
        'Block 1 - name',
        'Block 1 - contact.email',
      ]);

      emailServiceMock.sendSeparateBlocks = [];
      component.getBlockData();
      expect(component.blockFieldSelect).toEqual([]);
    });
  });

  describe('grid action', () => {
    beforeEach(() => {
      emailServiceMock.isGridAction = true;
      emailServiceMock.sendSeparateBlocks = ['Block 1'];
      emailServiceMock.emailDistributionList = { to: [], cc: [], bcc: [] };
      emailServiceMock.quickEmailDistributionListQuery = {
        to: [],
        cc: [],
        bcc: [],
      };
    });

    it('offers the grid action query fields as body tokens when sending separate emails', () => {
      emailServiceMock.gridActionSendSeparateEmail = true;
      emailServiceMock.gridActionDataQuery = {
        fields: [
          { name: 'name' },
          { name: 'contact', fields: [{ name: 'email' }] },
        ],
      };
      createComponent(() => {
        jest
          .spyOn(component, 'loadDistributionList')
          .mockResolvedValue(undefined);
      });
      expect(emailServiceMock.resetPreviewData).toHaveBeenCalledTimes(1);
      expect(component.firstBlockFields).toEqual(['name', 'contact.email']);
      expect(component.blockFieldSelect).toEqual([
        'Block 1 - name',
        'Block 1 - contact.email',
      ]);
    });

    it('offers no body tokens when send separate email is disabled', () => {
      emailServiceMock.sendSeparateBlocks = [];
      emailServiceMock.gridActionDataQuery = { fields: [{ name: 'name' }] };
      createComponent(() => {
        jest
          .spyOn(component, 'loadDistributionList')
          .mockResolvedValue(undefined);
      });
      expect(component.blockFieldSelect).toEqual([]);
    });
  });

  describe('insertTokenToBody', () => {
    let editor: {
      insertContent: jest.Mock;
      getContent: jest.Mock;
      getBody: jest.Mock;
      selection: { getRng: jest.Mock; setCursorLocation: jest.Mock };
    };

    beforeEach(() => {
      createComponent();
      editor = {
        insertContent: jest.fn(),
        getContent: jest.fn(() => '<p>Hello {{Block 1.name}}</p>'),
        getBody: jest.fn(() => ({})),
        selection: {
          getRng: jest.fn(() => ({ startOffset: 6 })),
          setCursorLocation: jest.fn(),
        },
      };
      component.bodyEditor = { editor } as any;
      component.layoutForm.get('block')?.setValue('Block 1');
    });

    it('wraps a per-record field path into a dataset token', () => {
      component.insertTokenToBody('Block 1.name');

      expect(editor.insertContent).toHaveBeenCalledWith('{{Block 1.name}}');
      expect(editor.selection.setCursorLocation).toHaveBeenCalledWith(
        expect.anything(),
        6 + '{{Block 1.name}}'.length
      );
      expect(component.layoutForm.get('body')?.value).toBe(
        '<p>Hello {{Block 1.name}}</p>'
      );
      expect(component.layoutForm.get('block')?.value).toBeNull();
      expect(component.showBodyValidator).toBe(false);
    });

    it('keeps nested field paths intact in the token', () => {
      component.insertTokenToBody('Block 2.contact.email');
      expect(editor.insertContent).toHaveBeenCalledWith(
        '{{Block 2.contact.email}}'
      );
    });

    it('inserts a time token as-is, padded with spaces', () => {
      component.insertTokenToBody('{{today.date}}', true);
      expect(editor.insertContent).toHaveBeenCalledWith(' {{today.date}} ');
    });

    it('does nothing when the selection is cleared', () => {
      component.insertTokenToBody('');
      expect(editor.insertContent).not.toHaveBeenCalled();
      expect(component.layoutForm.get('block')?.value).toBe('Block 1');
    });

    it('logs an error and still resets the dropdown when the editor is missing', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      component.bodyEditor = null;

      component.insertTokenToBody('Block 1.name');

      expect(consoleError).toHaveBeenCalledWith(
        'Body TinyMCE editor is not initialised'
      );
      expect(component.layoutForm.get('block')?.value).toBeNull();
      consoleError.mockRestore();
    });
  });

  describe('ngOnDestroy', () => {
    it('clears the body field select options', () => {
      emailServiceMock.sendSeparateBlocks = ['Block 1'];
      createComponent();
      expect(component.blockFieldSelect.length).toBeGreaterThan(0);

      component.ngOnDestroy();

      expect(component.blockFieldSelect).toEqual([]);
    });
  });

  describe('grid action recipient gate', () => {
    /**
     * Creates the layout step as a grid action, with a valid subject and body.
     *
     * @param options Grid action flags
     * @param options.sendSeparateEmail Whether the grid action sends one email per record
     * @param options.isPreviewTemplate Whether the To field is displayed
     */
    const createGridAction = (
      options: {
        sendSeparateEmail?: boolean;
        isPreviewTemplate?: boolean;
      } = {}
    ) => {
      emailServiceMock.isGridAction = true;
      emailServiceMock.gridActionSendSeparateEmail =
        options.sendSeparateEmail ?? false;
      emailServiceMock.sendSeparateBlocks = options.sendSeparateEmail
        ? ['Block 1']
        : [];
      emailServiceMock.hasSeparateEmailRecipients = false;
      emailServiceMock.disableNextActionBtn = false;
      emailServiceMock.emailDistributionList = { to: [], cc: [], bcc: [] };
      emailServiceMock.quickEmailDistributionListQuery = {
        to: [],
        cc: [],
        bcc: [],
      };
      emailServiceMock.allLayoutdata = {
        txtSubject: 'Subject',
        headerHtml: '',
        bodyHtml: '<p>Body</p>',
      };
      createComponent(() => {
        component.isPreviewTemplate = options.isPreviewTemplate ?? false;
        jest
          .spyOn(component, 'loadDistributionList')
          .mockResolvedValue(undefined);
      });
    };

    describe('validateQuickActionToEmails', () => {
      it('does nothing outside of grid actions', () => {
        createComponent();
        emailServiceMock.disableNextActionBtn = true;

        component.validateQuickActionToEmails();

        expect(emailServiceMock.disableNextActionBtn).toBe(true);
        expect(component.showRecipientError).toBe(false);
      });

      describe('single email', () => {
        it('disables Next and flags the To field when nobody is addressed', () => {
          createGridAction();
          component.layoutForm.get('to')?.setValue([]);

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(true);
          expect(component.showRecipientError).toBe(true);
        });

        it('enables Next once a To recipient is set', () => {
          createGridAction();
          component.layoutForm.get('to')?.setValue(['first@example.com']);

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(false);
          expect(component.showRecipientError).toBe(false);
        });

        it('keeps Next disabled on an invalid layout without blaming the recipients', () => {
          createGridAction();
          component.layoutForm.get('to')?.setValue(['first@example.com']);
          component.showSubjectValidator = true;

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(true);
          expect(component.showRecipientError).toBe(false);
        });
      });

      describe('send separate email', () => {
        it('requires a recipient from either the To field or the per-record list', () => {
          createGridAction({ sendSeparateEmail: true });
          component.layoutForm.get('to')?.setValue([]);
          emailServiceMock.hasSeparateEmailRecipients = false;

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(true);
          expect(component.showRecipientError).toBe(true);
        });

        it('accepts per-record recipients in place of the To field', () => {
          createGridAction({ sendSeparateEmail: true });
          component.layoutForm.get('to')?.setValue([]);
          emailServiceMock.hasSeparateEmailRecipients = true;

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(false);
          expect(component.showRecipientError).toBe(false);
        });

        it('accepts a To recipient when no per-record recipient was found', () => {
          createGridAction({ sendSeparateEmail: true });
          component.layoutForm.get('to')?.setValue(['first@example.com']);
          emailServiceMock.hasSeparateEmailRecipients = false;

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(false);
          expect(component.showRecipientError).toBe(false);
        });

        it('still gates Next on the layout validity', () => {
          createGridAction({ sendSeparateEmail: true });
          component.layoutForm.get('to')?.setValue([]);
          emailServiceMock.hasSeparateEmailRecipients = true;
          component.showBodyValidator = true;

          component.validateQuickActionToEmails();

          expect(emailServiceMock.disableNextActionBtn).toBe(true);
          expect(component.showRecipientError).toBe(false);
        });
      });
    });

    describe('onTxtSubjectChange', () => {
      it('defers to the recipient check when previewing a template', () => {
        createGridAction({ isPreviewTemplate: true });
        component.layoutForm.get('to')?.setValue([]);

        component.onTxtSubjectChange();

        expect(component.showSubjectValidator).toBe(false);
        expect(component.showBodyValidator).toBe(false);
        expect(emailServiceMock.disableNextActionBtn).toBe(true);
        expect(component.showRecipientError).toBe(true);
      });

      it('enables Next on a valid layout when there is no To field to satisfy', () => {
        createGridAction({ isPreviewTemplate: false });
        emailServiceMock.disableNextActionBtn = true;

        component.onTxtSubjectChange();

        expect(emailServiceMock.disableNextActionBtn).toBe(false);
        expect(component.showRecipientError).toBe(false);
      });

      it('disables Next when the subject is empty, whatever the recipients', () => {
        createGridAction({ isPreviewTemplate: true });
        component.layoutForm.get('to')?.setValue(['first@example.com']);
        component.layoutForm.get('subjectInput')?.setValue('   ');

        component.onTxtSubjectChange();

        expect(component.showSubjectValidator).toBe(true);
        expect(emailServiceMock.disableNextActionBtn).toBe(true);
      });
    });

    describe('loadDistributionList', () => {
      /** Grid action query, as passed by the grid widget */
      const DATA_QUERY = {
        queryName: 'allRecords',
        filter: { logic: 'and', filters: [] },
        fields: [{ name: 'name' }, { name: 'email' }],
        resource: 'res-1',
      };

      /**
       * Builds the notification form with an empty distribution list.
       *
       * @returns Datasets form
       */
      const buildDatasetsForm = () =>
        new FormGroup({
          datasets: new FormArray([buildBlock('Draft', ['name'])]),
          emailDistributionList: new FormGroup({
            to: new FormGroup({ inputEmails: new FormArray([]) }),
            cc: new FormGroup({ inputEmails: new FormArray([]) }),
            bcc: new FormGroup({ inputEmails: new FormArray([]) }),
          }),
        });

      /**
       * Creates the grid action layout step and runs the real distribution list load.
       *
       * @param options Grid action flags and API response
       * @param options.sendSeparateEmail Whether the grid action sends one email per record
       * @param options.queryName Query name of the grid action
       * @param options.response Response of the distribution list preview call
       * @returns The query sent to the distribution list preview call
       */
      const load = async (
        options: {
          sendSeparateEmail?: boolean;
          queryName?: string;
          response?: any;
        } = {}
      ) => {
        emailServiceMock.datasetsForm = buildDatasetsForm();
        emailServiceMock.allPreviewData = [
          {
            dataQuery: {
              ...DATA_QUERY,
              queryName: options.queryName ?? DATA_QUERY.queryName,
            },
            separateEmailFields: [{ name: 'email' }],
          },
        ];
        emailServiceMock.loadLayoutDistributionList = jest
          .fn()
          .mockResolvedValue(options.response ?? { to: [], cc: [], bcc: [] });
        createGridAction({
          sendSeparateEmail: options.sendSeparateEmail,
          isPreviewTemplate: true,
        });
        (component.loadDistributionList as jest.Mock).mockRestore();

        await component.loadDistributionList();

        return emailServiceMock.loadLayoutDistributionList.mock.calls[0][0];
      };

      it('sends the grid action query as a send-separate dataset when sending separately', async () => {
        const query = await load({ sendSeparateEmail: true });

        expect(
          emailServiceMock.loadLayoutDistributionList
        ).toHaveBeenCalledTimes(1);
        expect(query.datasets[0]).toMatchObject({
          name: 'Block 1',
          individualEmail: true,
          individualEmailFields: [{ name: 'email' }],
          resource: 'res-1',
          query: {
            name: 'allRecords',
            filter: DATA_QUERY.filter,
            fields: DATA_QUERY.fields,
          },
        });
      });

      it('leaves the dataset untouched for a single email', async () => {
        const query = await load({ sendSeparateEmail: false });

        expect(query.datasets[0].name).toBe('Draft');
        expect(query.datasets[0].individualEmail).toBeUndefined();
        expect(query.datasets[0].query.name).toBe('query');
      });

      it('leaves the dataset untouched when the grid action has no query name', async () => {
        const query = await load({ sendSeparateEmail: true, queryName: '' });

        expect(query.datasets[0].name).toBe('Draft');
        expect(query.datasets[0].individualEmail).toBeUndefined();
      });

      it('stores the deduplicated per-record recipients for read-only display', async () => {
        await load({
          sendSeparateEmail: true,
          response: {
            to: [],
            cc: [],
            bcc: [],
            individualEmailList: [
              {
                name: 'Block 1',
                emails: [
                  'first@example.com',
                  'first@example.com',
                  'second@example.com',
                ],
              },
            ],
          },
        });

        expect(emailServiceMock.distributionListSeparate).toEqual([
          {
            name: 'Block 1',
            emails: ['first@example.com', 'second@example.com'],
            isExpanded: false,
          },
        ]);
      });

      it('clears stale per-record recipients when the response has none', async () => {
        emailServiceMock.distributionListSeparate = [
          { name: 'Block 1', emails: ['stale@example.com'] },
        ];

        await load({ sendSeparateEmail: true });

        expect(emailServiceMock.distributionListSeparate).toEqual([]);
      });

      it('flags the missing recipient once the list resolves empty', async () => {
        await load();

        expect(component.showRecipientError).toBe(true);
        expect(emailServiceMock.disableNextActionBtn).toBe(true);
      });

      it('clears the recipient error once the list provides a To recipient', async () => {
        await load({
          response: { to: ['first@example.com'], cc: [], bcc: [] },
        });

        expect(component.layoutForm.get('to')?.value).toEqual([
          'first@example.com',
        ]);
        expect(component.showRecipientError).toBe(false);
        expect(emailServiceMock.disableNextActionBtn).toBe(false);
      });
    });
  });
});
