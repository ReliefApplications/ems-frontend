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
    it('lists every first-block field for each send-separate block', () => {
      emailServiceMock.sendSeparateBlocks = ['Block 1', 'Block 2'];
      createComponent();
      expect(component.firstBlockFields).toEqual(FIRST_BLOCK_FIELDS);
      expect(component.blockFieldSelect).toEqual([
        'Block 1 - name',
        'Block 1 - contact.email',
        'Block 2 - name',
        'Block 2 - contact.email',
      ]);
    });

    it('only lists blocks flagged as send-separate', () => {
      emailServiceMock.sendSeparateBlocks = ['Block 2'];
      createComponent();
      expect(component.blockFieldSelect).toEqual([
        'Block 2 - name',
        'Block 2 - contact.email',
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

    it('clears the send-separate blocks so no body tokens are offered', () => {
      createComponent(() => {
        jest
          .spyOn(component, 'loadDistributionList')
          .mockResolvedValue(undefined);
      });
      expect(emailServiceMock.resetPreviewData).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.sendSeparateBlocks).toEqual([]);
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
});
