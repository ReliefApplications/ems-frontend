import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { Apollo, gql } from 'apollo-angular';
import { chunk, flatten, get, isNil } from 'lodash';
import {
  Observable,
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import { RecordQueryResponse } from '../../../models/record.model';
import { GET_RESOURCE_QUESTION_DRAFT_RECORD } from '../../graphql/queries';
import {
  ChoiceItem,
  ChoicesLoader,
  ChoicesLoadOptions,
  ChoicesPage,
  setChoicesLoader,
} from '../../widgets/utils/choices-loader';

/** Resource field definition, as stored in the resource fields */
export interface ResourceField {
  name: string;
  type?: string;
  resource?: string;
  referenceData?: any;
  choices?: any[];
  choicesByUrl?: any;
  choicesByGraphQL?: any;
  isCalculated?: boolean;
}

/** Information needed to load the records of a resource question */
export interface ResourceQuestionInfo {
  /** Name of the records query generated for the resource */
  queryName?: string;
  /** Definition of the field displayed in the question */
  field?: ResourceField | null;
}

/** GraphQL selection of the display field, in the resource records query */
export interface DisplayFieldSelection {
  /** Name of the field in the GraphQL type of the resource */
  selection: string;
  /** Whether the query must ask for display values ( e.g. text of choices ) */
  display: boolean;
  /** Whether the query can sort / search on the field */
  searchable: boolean;
}

/** Field used to display the records when no display field is set */
const DEFAULT_DISPLAY_FIELD = 'incrementalId';
/** Maximum number of records fetched by ids in a single query */
const IDS_CHUNK_SIZE = 100;
/** Filters accepted by a question */
type QuestionFilters =
  | CompositeFilterDescriptor
  | FilterDescriptor
  | (CompositeFilterDescriptor | FilterDescriptor)[]
  | null
  | undefined;

/**
 * Gets the GraphQL selection of a display field, in the records query
 * generated for the resource. Mirrors the naming of the generated types.
 *
 * @param field Display field definition, if any
 * @returns Selection of the display field
 */
export const getDisplayFieldSelection = (
  field?: ResourceField | null
): DisplayFieldSelection => {
  if (!field?.name) {
    return {
      selection: DEFAULT_DISPLAY_FIELD,
      display: false,
      searchable: true,
    };
  }
  const name = field.name.trim().split('-').join('_');
  if (field.resource) {
    return {
      selection: field.type === 'resources' ? `${name}_ids` : `${name}_id`,
      display: false,
      searchable: false,
    };
  }
  if (field.referenceData) {
    return { selection: `${name}_ref`, display: false, searchable: false };
  }
  return {
    selection: name,
    display: !!(field.choices || field.choicesByUrl || field.choicesByGraphQL),
    searchable: true,
  };
};

/**
 * Gets the text displayed for a field value.
 *
 * @param value Field value
 * @returns Text to display
 */
export const getChoiceText = (value: any): string => {
  if (isNil(value)) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map((x) => getChoiceText(x))
      .filter((x) => x)
      .join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

/**
 * Builds the query fetching the records of a resource, with their display field only.
 *
 * @param queryName Name of the records query generated for the resource
 * @param selection GraphQL selection of the display field
 * @returns GraphQL query
 */
export const buildResourceRecordsQuery = (
  queryName: string,
  selection: string
) => gql`
  query GetResourceQuestionRecords(
    $first: Int
    $skip: Int
    $filter: JSON
    $sortField: String
    $sortOrder: String
    $display: Boolean
    $recordVisibility: RecordVisibility
  ) {
    ${queryName}(
      first: $first
      skip: $skip
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
      display: $display
      recordVisibility: $recordVisibility
    ) {
      edges {
        node {
          id
          ${selection}
        }
      }
      totalCount
    }
  }
`;

/**
 * Creates the choices loader of a resource question, fetching the records of
 * the resource through its generated query, page by page, with the display
 * field only.
 *
 * @param apollo Apollo client
 * @param options Loader options
 * @param options.queryName Name of the records query generated for the resource
 * @param options.field Definition of the display field, if any
 * @param options.filters Filters of the question, if any
 * @returns Choices loader
 */
export const createResourceRecordsLoader = (
  apollo: Apollo,
  options: {
    queryName: string;
    field?: ResourceField | null;
    filters?: QuestionFilters;
  }
): ChoicesLoader => {
  const { queryName } = options;
  const selection = getDisplayFieldSelection(options.field);
  const fieldName = options.field?.name || DEFAULT_DISPLAY_FIELD;
  const query = buildResourceRecordsQuery(queryName, selection.selection);

  /**
   * Maps the records of a query response to choice items.
   *
   * @param data Query response data
   * @returns Choice items
   */
  const toItems = (data: any): ChoiceItem[] =>
    (get(data, `${queryName}.edges`) || [])
      .map((edge: any) => edge?.node)
      .filter((node: any) => node?.id)
      .map((node: any) => ({
        value: node.id,
        text: getChoiceText(node[selection.selection]),
      }));

  /**
   * Builds the records filter, from the question filters and the search text.
   *
   * @param search Search text
   * @returns Records filter, if any
   */
  const buildFilter = (search: string) => {
    const filters: any[] = [];
    if (options.filters) {
      if (Array.isArray(options.filters)) {
        filters.push(...options.filters);
      } else {
        filters.push(options.filters);
      }
    }
    if (search && selection.searchable) {
      filters.push({ field: fieldName, operator: 'contains', value: search });
    }
    return filters.length > 0 ? { logic: 'and', filters } : undefined;
  };

  /**
   * Runs the records query.
   *
   * @param variables Query variables
   * @returns Query response data
   */
  const fetch = (variables: any): Observable<any> =>
    apollo
      .query<any>({
        query,
        variables: {
          ...variables,
          ...(selection.display && { display: true }),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map(({ data }) => data));

  return {
    load: ({ search, skip, take }: ChoicesLoadOptions) =>
      fetch({
        first: take,
        skip,
        filter: buildFilter(search),
        ...(selection.searchable && {
          sortField: fieldName,
          sortOrder: 'asc',
        }),
      }).pipe(
        map(
          (data): ChoicesPage => ({
            items: toItems(data),
            totalCount: get(data, `${queryName}.totalCount`, 0) || 0,
          })
        )
      ),
    loadByValues: (values: any[]) => {
      const ids = values.filter(
        (x) => typeof x === 'string' && /^[0-9a-fA-F]{24}$/.test(x)
      );
      if (ids.length === 0) {
        return of([]);
      }
      /**
       * Fetches records by ids, in chunks.
       *
       * @param idsToLoad Ids of the records to fetch
       * @param recordVisibility Visibility of the records, submitted by default
       * @returns Choice items of the records found
       */
      const fetchByIds = (
        idsToLoad: string[],
        recordVisibility?: string
      ): Observable<ChoiceItem[]> =>
        forkJoin(
          chunk(idsToLoad, IDS_CHUNK_SIZE).map((idsChunk) =>
            fetch({
              first: idsChunk.length,
              skip: 0,
              filter: {
                logic: 'and',
                filters: [{ field: 'ids', operator: 'eq', value: idsChunk }],
              },
              ...(recordVisibility && { recordVisibility }),
            }).pipe(map(toItems))
          )
        ).pipe(map((results) => flatten(results)));
      // Records created from the question while the form was saved as a
      // draft are drafts as well: look the missing ones up in the user's
      // own drafts, or reopening the draft form shows an empty selection
      return fetchByIds(ids).pipe(
        switchMap((items) => {
          const found = new Set(items.map((item) => item.value));
          const missing = ids.filter((id) => !found.has(id));
          if (missing.length === 0) {
            return of(items);
          }
          return fetchByIds(missing, 'ownDrafts').pipe(
            map((drafts) => [...items, ...drafts]),
            catchError(() => of(items))
          );
        })
      );
    },
  };
};

/**
 * Finds the drafts of the user among records of a resource.
 *
 * @param apollo Apollo client
 * @param queryName Name of the records query generated for the resource
 * @param ids Ids of the records
 * @returns Ids of the records which are drafts of the user
 */
export const loadOwnDraftIds = (
  apollo: Apollo,
  queryName: string,
  ids: string[]
): Observable<string[]> => {
  if (ids.length === 0) {
    return of([]);
  }
  const query = buildResourceRecordsQuery(queryName, DEFAULT_DISPLAY_FIELD);
  return forkJoin(
    chunk(ids, IDS_CHUNK_SIZE).map((idsChunk) =>
      apollo
        .query<any>({
          query,
          variables: {
            first: idsChunk.length,
            skip: 0,
            filter: {
              logic: 'and',
              filters: [{ field: 'ids', operator: 'eq', value: idsChunk }],
            },
            recordVisibility: 'ownDrafts',
          },
          fetchPolicy: 'no-cache',
        })
        .pipe(
          map(({ data }) =>
            (get(data, `${queryName}.edges`) || [])
              .map((edge: any) => edge?.node?.id)
              .filter((id: any) => !!id)
          )
        )
    )
  ).pipe(map((results) => flatten(results)));
};

/**
 * Restores the records created from a resource(s) question which are still
 * drafts, when the question is loaded with them: the form was saved as a
 * draft, then reopened.
 *
 * Records created from a question are drafts until the form is submitted.
 * They are not returned by the records queries of the question ( e.g. its
 * grid ), which display them from the data kept on the question when they
 * are created. This data is lost once the form is closed: it is fetched
 * again, so the drafts are handled as they were when created.
 *
 * @param apollo Apollo client
 * @param question Resource / resources question
 * @param queryName Name of the records query generated for the resource
 * @returns Whether drafts were restored
 */
export const restoreCreatedDraftRecords = async (
  apollo: Apollo,
  question: any,
  queryName: string
): Promise<boolean> => {
  const selected: any[] = Array.isArray(question.value)
    ? question.value
    : [question.value];
  /** Records looked up already: submitted records are not drafts */
  const checked: Set<string> = (question._checkedDraftIds =
    question._checkedDraftIds || new Set<string>());
  const ids = selected.filter(
    (id) =>
      typeof id === 'string' &&
      /^[0-9a-fA-F]{24}$/.test(id) &&
      !(question.draftData && id in question.draftData) &&
      !checked.has(id)
  );
  if (ids.length === 0) {
    return false;
  }
  ids.forEach((id) => checked.add(id));
  try {
    const draftIds = await firstValueFrom(
      loadOwnDraftIds(apollo, queryName, ids)
    );
    const records = await Promise.all(
      draftIds.map((id) =>
        firstValueFrom(
          apollo.query<RecordQueryResponse>({
            query: GET_RESOURCE_QUESTION_DRAFT_RECORD,
            variables: { id },
            fetchPolicy: 'no-cache',
          })
        ).then(({ data }) => data?.record)
      )
    );
    const drafts = records.filter((record) => !!record?.id);
    if (drafts.length === 0) {
      return false;
    }
    const draftData = { ...question.draftData };
    drafts.forEach((record) => {
      draftData[record.id as string] = record.data || {};
    });
    question.draftData = draftData;
    const restoredIds = drafts.map((record) => record.id as string);
    if (Array.isArray(question.value)) {
      const created: string[] = question.newCreatedRecords || [];
      question.newCreatedRecords = [
        ...created,
        ...restoredIds.filter((id) => !created.includes(id)),
      ];
    } else {
      question.newCreatedRecords = restoredIds[0];
    }
    // Form the records are created with
    question.template = question.template || question.addTemplate;
    return true;
  } catch {
    // Look the records up again next time
    ids.forEach((id) => checked.delete(id));
    return false;
  }
};

/**
 * Sets up the choices loader of a resource question, from the resource
 * information stored on the question and its current filters.
 *
 * @param apollo Apollo client
 * @param question Resource / resources question
 * @returns The choices loader, or null if the resource information is not loaded yet
 */
export const setupResourceChoicesLoader = (
  apollo: Apollo,
  question: any
): ChoicesLoader | null => {
  const info: ResourceQuestionInfo | undefined = question._resourceInfo;
  if (!info?.queryName || !question.contentQuestion) {
    return null;
  }
  const loader = createResourceRecordsLoader(apollo, {
    queryName: info.queryName,
    field: info.field,
    filters: question.filters,
  });
  setChoicesLoader(question.contentQuestion, loader);
  return loader;
};
