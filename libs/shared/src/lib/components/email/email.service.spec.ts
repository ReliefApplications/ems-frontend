import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import { RestService } from '../../services/rest/rest.service';
import { EmailService } from './email.service';

/** Shape used to seed a dataset block in the notification form */
interface BlockSeed {
  name: string;
  queryName?: string | null;
  resource?: string | null;
  reference?: string | null;
  individualEmail?: boolean;
  fields?: any[];
}

describe('EmailService (components/email)', () => {
  let service: EmailService;

  /**
   * Replaces the datasets of the notification form with the given blocks.
   *
   * @param blocks Blocks to seed, in order
   */
  const seedDatasets = (blocks: BlockSeed[]) => {
    const datasets = service.datasetsForm.get('datasets') as FormArray;
    datasets.clear();
    blocks.forEach((block) => {
      const group: FormGroup = service.createNewDataSetGroup();
      group.patchValue({
        name: block.name,
        resource: block.resource ?? null,
        reference: block.reference ?? null,
        individualEmail: block.individualEmail ?? false,
        query: { name: block.queryName ?? null },
      });
      const fields = group.get('query.fields') as FormArray;
      (block.fields ?? [{ name: 'title' }]).forEach((field) =>
        fields.push(new FormControl(field))
      );
      datasets.push(group);
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        TranslateService,
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: {} },
        { provide: RestService, useValue: { apiUrl: '' } },
        { provide: SnackbarService, useValue: { openSnackBar: jest.fn() } },
      ],
    });
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.sendSeparateBlocks).toEqual([]);
  });

  describe('createPreviewData', () => {
    it('collects the send-separate blocks among resource-backed datasets', () => {
      seedDatasets([
        { name: 'Block 1', queryName: 'Q1', resource: 'r1' },
        {
          name: 'Block 2',
          queryName: 'Q2',
          resource: 'r2',
          individualEmail: true,
        },
        {
          name: 'Block 3',
          queryName: 'Q3',
          resource: 'r3',
          individualEmail: true,
        },
      ]);

      service.createPreviewData();

      expect(service.previewData.datasets).toEqual([
        'Block 1',
        'Block 2',
        'Block 3',
      ]);
      expect(service.sendSeparateBlocks).toEqual(['Block 2', 'Block 3']);
    });

    it('treats reference-backed datasets like resource-backed ones', () => {
      seedDatasets([
        {
          name: 'Ref block',
          queryName: 'Q1',
          reference: 'ref1',
          individualEmail: true,
        },
        { name: 'Other ref block', queryName: 'Q2', reference: 'ref2' },
      ]);

      service.createPreviewData();

      expect(service.previewData.datasets).toEqual([
        'Ref block',
        'Other ref block',
      ]);
      expect(service.sendSeparateBlocks).toEqual(['Ref block']);
    });

    it('ignores blocks that have no query name or no data source, even if send-separate', () => {
      seedDatasets([
        { name: 'No query', resource: 'r1', individualEmail: true },
        { name: 'No source', queryName: 'Q2', individualEmail: true },
        {
          name: 'Complete',
          queryName: 'Q3',
          resource: 'r3',
          individualEmail: true,
        },
      ]);

      service.createPreviewData();

      expect(service.previewData.datasets).toEqual(['Complete']);
      expect(service.sendSeparateBlocks).toEqual(['Complete']);
    });

    it('rebuilds the send-separate list from scratch on every call', () => {
      seedDatasets([
        {
          name: 'Block 1',
          queryName: 'Q1',
          resource: 'r1',
          individualEmail: true,
        },
      ]);
      service.createPreviewData();
      expect(service.sendSeparateBlocks).toEqual(['Block 1']);

      // Same form, second call: must not accumulate duplicates
      service.createPreviewData();
      expect(service.sendSeparateBlocks).toEqual(['Block 1']);

      // Block no longer sent separately: must drop it
      seedDatasets([{ name: 'Block 1', queryName: 'Q1', resource: 'r1' }]);
      service.createPreviewData();
      expect(service.sendSeparateBlocks).toEqual([]);
    });

    it('flattens the first block fields, including nested ones', () => {
      seedDatasets([
        {
          name: 'Block 1',
          queryName: 'Q1',
          resource: 'r1',
          fields: [
            { name: 'title' },
            { name: 'owner', fields: [{ name: 'name' }, { name: 'email' }] },
          ],
        },
        {
          name: 'Block 2',
          queryName: 'Q2',
          resource: 'r2',
          fields: [{ name: 'ignored' }],
        },
      ]);

      service.createPreviewData();

      expect(service.previewData.fields).toEqual([
        'title',
        'owner.name',
        'owner.email',
      ]);
    });

    it('does nothing when the form has no datasets', () => {
      (service.datasetsForm.get('datasets') as FormArray).clear();

      service.createPreviewData();

      expect(service.previewData).toBeUndefined();
      expect(service.sendSeparateBlocks).toEqual([]);
    });
  });

  describe('resetPreviewData', () => {
    it('clears the preview data but keeps deriving send-separate blocks from the form', () => {
      seedDatasets([
        {
          name: 'Block 1',
          queryName: 'Q1',
          resource: 'r1',
          individualEmail: true,
        },
      ]);
      service.createPreviewData();
      expect(service.sendSeparateBlocks).toEqual(['Block 1']);

      service.resetPreviewData();

      expect(service.previewData).toEqual({ datasets: [], fields: [] });
      // Derived from the datasets form, which reset does not touch
      expect(service.sendSeparateBlocks).toEqual(['Block 1']);
    });
  });

  describe('sendSeparateBlocks in grid action mode', () => {
    beforeEach(() => {
      service.isGridAction = true;
      // A seeded send-separate block must be ignored in grid action mode
      seedDatasets([
        {
          name: 'Ignored',
          queryName: 'Q1',
          resource: 'r1',
          individualEmail: true,
        },
      ]);
    });

    afterEach(() => {
      service.isGridAction = false;
    });

    it('is the single default block when send separate email is enabled', () => {
      service.gridActionSendSeparateEmail = true;
      expect(service.sendSeparateBlocks).toEqual(['Block 1']);
    });

    it('is empty when send separate email is disabled', () => {
      service.gridActionSendSeparateEmail = false;
      expect(service.sendSeparateBlocks).toEqual([]);
    });
  });

  describe('hasSeparateEmailRecipients', () => {
    it('is false when no send-separate recipients were loaded', () => {
      service.distributionListSeparate = [];
      expect(service.hasSeparateEmailRecipients).toBe(false);
    });

    it('is false when every block resolved to no recipient', () => {
      service.distributionListSeparate = [
        { name: 'Block 1', emails: [] },
        { name: 'Block 2' },
      ];
      expect(service.hasSeparateEmailRecipients).toBe(false);
    });

    it('is true as soon as one block has a recipient', () => {
      service.distributionListSeparate = [
        { name: 'Block 1', emails: [] },
        { name: 'Block 2', emails: ['first@example.com'] },
      ];
      expect(service.hasSeparateEmailRecipients).toBe(true);
    });

    it('tolerates a missing recipient list', () => {
      (service as any).distributionListSeparate = undefined;
      expect(service.hasSeparateEmailRecipients).toBe(false);
    });
  });

  describe('Common Services users filter', () => {
    /** Static reference fields, as the UI lists them */
    const STATIC_FIELD_NAMES = [
      'Application',
      'PermissionAccessType',
      'SystemRole',
      'SystemPosition',
      'Country',
      'Region',
      'LocationType',
      'InternalExternal',
    ];

    /**
     * Installs a fake Common Services GraphQL client on the service.
     *
     * @param fields Fields the user table introspection returns
     * @returns The query spy
     */
    const installCsClient = (fields: any[]) => {
      const query = jest.fn(() => of({ data: { __type: { fields } } }));
      (service as any).apollo = { use: jest.fn(() => ({ query })) };
      return query;
    };

    describe('dataset form', () => {
      it('gives every new dataset an empty filter and the distribution list toggle off', () => {
        const group = service.createNewDataSetGroup();

        expect(group.get('individualEmailToDistributionList')?.value).toBe(
          false
        );
        expect(group.get('csFilter')?.getRawValue()).toEqual({
          logic: 'and',
          filters: [],
        });
      });

      it('resets the distribution list optionality when a new form is built', () => {
        service.isDistributionListOptional = true;

        service.setDatasetForm();

        expect(service.isDistributionListOptional).toBe(false);
      });
    });

    describe('optional distribution list', () => {
      it('treats the distribution list as valid when it is optional', async () => {
        service.isDistributionListOptional = true;

        await expect(service.checkDLToValid()).resolves.toBe(true);
      });

      it('never blocks Next when the distribution list is optional', async () => {
        service.isDistributionListOptional = true;
        service.distributionListName = '';
        const toCheck = jest.spyOn(service, 'isToValidCheck');
        const next = jest.spyOn(service.disableSaveAndProceed, 'next');

        await service.validateNextButton();

        expect(next).toHaveBeenCalledWith(false);
        expect(toCheck).not.toHaveBeenCalled();
      });

      it('still checks the To recipients when the distribution list is required', async () => {
        service.isDistributionListOptional = false;
        service.distributionListName = 'DL';
        const toCheck = jest
          .spyOn(service, 'isToValidCheck')
          .mockResolvedValue(undefined);

        await service.validateNextButton();

        expect(toCheck).toHaveBeenCalledTimes(1);
      });
    });

    describe('buildCommonServiceFields', () => {
      it('combines the static reference fields with the scalar user table fields', async () => {
        installCsClient([
          { name: 'firstname', type: { kind: 'SCALAR' } },
          { name: 'groups', type: { kind: 'LIST' } },
          { name: 'agency', type: { kind: 'SCALAR' } },
        ]);

        await service.buildCommonServiceFields();

        expect(service.userTableFields).toEqual(['firstname', 'agency']);
        expect(
          service.computedCommonServiceFields.map((field) => field.name)
        ).toEqual([...STATIC_FIELD_NAMES, 'firstname', 'agency']);
        expect(service.computedCommonServiceFields[0]).toMatchObject({
          kind: 'SCALAR',
          type: 'checkbox',
          editor: 'select',
          isCommonService: true,
        });
        expect(
          service.computedCommonServiceFields[STATIC_FIELD_NAMES.length]
        ).toMatchObject({
          graphQLFieldName: 'firstname',
          type: 'text',
          editor: 'text',
          isCommonService: true,
        });
      });

      it('queries the user table once for concurrent and repeated callers', async () => {
        const query = installCsClient([
          { name: 'firstname', type: { kind: 'SCALAR' } },
        ]);

        await Promise.all([
          service.buildCommonServiceFields(),
          service.buildCommonServiceFields(),
        ]);
        await service.buildCommonServiceFields();

        expect(query).toHaveBeenCalledTimes(1);
        expect(service.computedCommonServiceFields).toHaveLength(
          STATIC_FIELD_NAMES.length + 1
        );
      });

      it('falls back to the static fields when the user table cannot be read', async () => {
        const consoleError = jest
          .spyOn(console, 'error')
          .mockImplementation(() => undefined);
        (service as any).apollo = {
          use: jest.fn(() => ({
            query: jest.fn(() => throwError(() => new Error('CS down'))),
          })),
        };

        await service.buildCommonServiceFields();

        expect(consoleError).toHaveBeenCalled();
        expect(
          service.computedCommonServiceFields.map((field) => field.name)
        ).toEqual(STATIC_FIELD_NAMES);
        consoleError.mockRestore();
      });
    });
  });
});
