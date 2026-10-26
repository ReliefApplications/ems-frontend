import { of } from 'rxjs';
import {
  createResourceRecordsLoader,
  getChoiceText,
  getDisplayFieldSelection,
  setupResourceChoicesLoader,
} from './resource-records-loader';

/**
 * Builds a fake Apollo client returning the given records for any query.
 *
 * @param queryName Name of the records query
 * @param nodes Records returned by the query
 * @param totalCount Total number of records
 * @returns Fake Apollo client, with a jest mock for query
 */
const createFakeApollo = (queryName: string, nodes: any[], totalCount = 0) => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  query: jest.fn((_options: any) =>
    of({
      data: {
        [queryName]: {
          edges: nodes.map((node) => ({ node })),
          totalCount,
        },
      },
    })
  ),
});

describe('resource records loader', () => {
  describe('getDisplayFieldSelection', () => {
    it('falls back to the incremental id when no display field is set', () => {
      expect(getDisplayFieldSelection(null)).toEqual({
        selection: 'incrementalId',
        display: false,
        searchable: true,
      });
    });

    it('selects scalar fields as is', () => {
      expect(getDisplayFieldSelection({ name: 'name', type: 'text' })).toEqual({
        selection: 'name',
        display: false,
        searchable: true,
      });
    });

    it('asks for display values on choice fields', () => {
      expect(
        getDisplayFieldSelection({
          name: 'status',
          type: 'dropdown',
          choices: ['a', 'b'],
        })
      ).toEqual({ selection: 'status', display: true, searchable: true });
    });

    it('uses the generated names of resource and reference data fields', () => {
      expect(
        getDisplayFieldSelection({
          name: 'country',
          type: 'resource',
          resource: 'resource-id',
        }).selection
      ).toBe('country_id');
      expect(
        getDisplayFieldSelection({
          name: 'countries',
          type: 'resources',
          resource: 'resource-id',
        }).selection
      ).toBe('countries_ids');
      expect(
        getDisplayFieldSelection({
          name: 'region',
          type: 'dropdown',
          referenceData: { id: 'ref-id' },
        })
      ).toEqual({ selection: 'region_ref', display: false, searchable: false });
    });
  });

  describe('getChoiceText', () => {
    it('formats values as displayable text', () => {
      expect(getChoiceText(null)).toBe('');
      expect(getChoiceText('France')).toBe('France');
      expect(getChoiceText(12)).toBe('12');
      expect(getChoiceText(['a', null, 'b'])).toBe('a, b');
      expect(getChoiceText({ a: 1 })).toBe('{"a":1}');
    });
  });

  describe('createResourceRecordsLoader', () => {
    it('loads a page of records with the display field only, sorted and filtered', (done) => {
      const apollo = createFakeApollo(
        'allCountries',
        [
          { id: '1', name: 'France' },
          { id: '2', name: 'Germany' },
        ],
        20
      );
      const loader = createResourceRecordsLoader(apollo as any, {
        queryName: 'allCountries',
        field: { name: 'name', type: 'text' },
        filters: { field: 'region', operator: 'eq', value: 'EU' },
      });

      loader.load({ search: 'an', skip: 10, take: 5 }).subscribe((page) => {
        expect(page).toEqual({
          items: [
            { value: '1', text: 'France' },
            { value: '2', text: 'Germany' },
          ],
          totalCount: 20,
        });
        const call = apollo.query.mock.calls[0][0] as any;
        expect(call.variables).toEqual({
          first: 5,
          skip: 10,
          sortField: 'name',
          sortOrder: 'asc',
          filter: {
            logic: 'and',
            filters: [
              { field: 'region', operator: 'eq', value: 'EU' },
              { field: 'name', operator: 'contains', value: 'an' },
            ],
          },
        });
        expect(call.fetchPolicy).toBe('no-cache');
        done();
      });
    });

    it('asks for display values when the display field has choices', (done) => {
      const apollo = createFakeApollo(
        'allCountries',
        [{ id: '1', status: 'Active' }],
        1
      );
      const loader = createResourceRecordsLoader(apollo as any, {
        queryName: 'allCountries',
        field: { name: 'status', type: 'dropdown', choices: ['active'] },
      });

      loader.load({ search: '', skip: 0, take: 50 }).subscribe((page) => {
        expect(page.items).toEqual([{ value: '1', text: 'Active' }]);
        const call = apollo.query.mock.calls[0][0] as any;
        expect(call.variables.display).toBe(true);
        expect(call.variables.filter).toBeUndefined();
        done();
      });
    });

    it('loads records by ids, ignoring invalid ids', (done) => {
      const apollo = createFakeApollo(
        'allCountries',
        [{ id: '64b7f0c2e4b0a1a2b3c4d5e6', name: 'France' }],
        1
      );
      const loader = createResourceRecordsLoader(apollo as any, {
        queryName: 'allCountries',
        field: { name: 'name', type: 'text' },
      });

      loader
        .loadByValues(['64b7f0c2e4b0a1a2b3c4d5e6', 'not-an-id', null])
        .subscribe((items) => {
          expect(items).toEqual([
            { value: '64b7f0c2e4b0a1a2b3c4d5e6', text: 'France' },
          ]);
          const call = apollo.query.mock.calls[0][0] as any;
          expect(call.variables.filter).toEqual({
            logic: 'and',
            filters: [
              {
                field: 'ids',
                operator: 'eq',
                value: ['64b7f0c2e4b0a1a2b3c4d5e6'],
              },
            ],
          });
          done();
        });
    });

    it('does not query when there is no valid id to load', (done) => {
      const apollo = createFakeApollo('allCountries', []);
      const loader = createResourceRecordsLoader(apollo as any, {
        queryName: 'allCountries',
      });

      loader.loadByValues(['draft-record']).subscribe((items) => {
        expect(items).toEqual([]);
        expect(apollo.query).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('setupResourceChoicesLoader', () => {
    it('sets the loader on the content question once the resource information is loaded', () => {
      const apollo = createFakeApollo('allCountries', []);
      const contentQuestion = {
        getPropertyValue: jest.fn(),
        setPropertyValue: jest.fn(),
      };
      const question: any = { contentQuestion };

      expect(setupResourceChoicesLoader(apollo as any, question)).toBeNull();
      expect(contentQuestion.setPropertyValue).not.toHaveBeenCalled();

      question._resourceInfo = { queryName: 'allCountries', field: null };
      const loader = setupResourceChoicesLoader(apollo as any, question);

      expect(loader).not.toBeNull();
      expect((contentQuestion as any).choicesLoader).toBe(loader);
      expect(contentQuestion.setPropertyValue).toHaveBeenCalledWith(
        'choicesLoaderVersion',
        1
      );
    });
  });
});
