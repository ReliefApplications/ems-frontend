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
      service.sendSeparateBlocks = ['stale'];

      service.createPreviewData();

      expect(service.previewData).toBeUndefined();
      expect(service.sendSeparateBlocks).toEqual(['stale']);
    });
  });

  describe('resetPreviewData', () => {
    it('clears the preview data and the send-separate blocks', () => {
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
      expect(service.sendSeparateBlocks).toEqual([]);
    });
  });
});
