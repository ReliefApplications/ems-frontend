import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';

// populateMetaFields reads / writes the localForage cache, which has no
// storage driver under jest. Stub it so every source is fetched.
jest.mock('../../utils/cache-with-expiry', () => ({
  getListOfKeys: jest.fn().mockResolvedValue([]),
  getWithExpiry: jest.fn().mockResolvedValue(null),
  setWithExpiry: jest.fn().mockResolvedValue(undefined),
}));

import { GridService } from './grid.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} },
        TranslateService,
        { provide: Apollo, useValue: {} },
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('populateMetaFields', () => {
    const csApiUrl = 'https://cs.example/api';
    /**
     * Field whose filter choices come from the Common Services GraphQL API.
     *
     * @returns fresh meta definition, so each test gets its own object
     */
    const csField = () => ({
      choicesByGraphQL: {
        url: `${csApiUrl}/graphql`,
        query: '{ countrys { id name } }',
        path: '$.data.countrys[*]',
        value: 'id',
        text: 'name',
      },
    });
    const csError = new Error(
      'this user or application does not have access to the graphql endpoint'
    );

    beforeEach(() => {
      (service as any).environment = { csApiUrl };
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    it('should resolve with empty choices when Common Services rejects the request', async () => {
      (service as any).apollo = {
        use: () => ({ query: () => throwError(() => csError) }),
      };
      const metaFields: any = {
        country: csField(),
        status: { choices: [{ value: 'open', text: 'Open' }] },
      };

      await expect(
        service.populateMetaFields(metaFields)
      ).resolves.toBeUndefined();

      expect(metaFields.country.choices).toEqual([]);
      expect(metaFields.status.choices).toEqual([
        { value: 'open', text: 'Open' },
      ]);
      expect(console.error).toHaveBeenCalled();
    });

    it('should still populate the other sources when one of them fails', async () => {
      const query = jest
        .fn()
        .mockReturnValueOnce(throwError(() => csError))
        .mockReturnValueOnce(
          of({ data: { countrys: [{ id: 'FR', name: 'France' }] } })
        );
      (service as any).apollo = { use: () => ({ query }) };
      const metaFields: any = { failing: csField(), working: csField() };

      await service.populateMetaFields(metaFields);

      expect(metaFields.failing.choices).toEqual([]);
      expect(metaFields.working.choices).toEqual([
        { value: 'FR', text: 'France' },
      ]);
    });
  });

  describe('getFields / readOnlyFields', () => {
    /** Minimal scalar field definition, as saved in a grid widget query. */
    const fields = [{ name: 'email', label: 'Email', type: 'Text' }];

    it('should disable a field listed in readOnlyFields, even if the user can update it', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: true } },
      };

      const result = service.getFields(fields, metaFields, {}, '', {
        disabled: false,
        hidden: false,
        filter: true,
        readOnlyFields: ['email'],
      });

      expect(result[0].disabled).toBe(true);
    });

    it('should keep a field editable when it is not listed in readOnlyFields and the user can update it', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: true } },
      };

      const result = service.getFields(fields, metaFields, {}, '', {
        disabled: false,
        hidden: false,
        filter: true,
        readOnlyFields: [],
      });

      expect(result[0].disabled).toBe(false);
    });

    it('should still disable a field the user cannot update, regardless of readOnlyFields', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: false } },
      };

      const result = service.getFields(fields, metaFields, {}, '', {
        disabled: false,
        hidden: false,
        filter: true,
        readOnlyFields: [],
      });

      expect(result[0].disabled).toBe(true);
    });

    it('should carry the outdated files display option of file fields', () => {
      const fileFields = [
        { name: 'documents', label: 'Documents', type: 'JSON' },
        {
          name: 'all',
          label: 'All documents',
          type: 'JSON',
          showOutdatedFiles: true,
        },
      ];
      const metaFields = {
        documents: { type: 'file', permissions: { canSee: true } },
        all: { type: 'file', permissions: { canSee: true } },
      };

      const result = service.getFields(fileFields, metaFields, {}, '');

      expect(result[0].showOutdatedFiles).toBe(false);
      expect(result[1].showOutdatedFiles).toBe(true);
    });

    it('should default to no read-only fields when the option is omitted', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: true } },
      };

      // called without the 5th ( options ) argument, as done before this feature existed
      const result = service.getFields(fields, metaFields, {}, '');

      expect(result[0].disabled).toBe(false);
    });
  });
});
