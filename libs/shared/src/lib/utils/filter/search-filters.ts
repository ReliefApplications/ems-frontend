/** Field types whose raw value is searched with a text contains */
const TEXT_TYPES = [
  'text',
  'color',
  'email',
  'tel',
  'url',
  'comment',
  'radiogroup',
  'dropdown',
  'editor',
];

/**
 * Field types storing one or several values from a choice list. Includes
 * users / owner, whose meta carries the user / role list as choices.
 */
const CHOICE_TYPES = [
  'radiogroup',
  'dropdown',
  'checkbox',
  'tagbox',
  'users',
  'owner',
];

/**
 * Returns the values of the choices whose display text matches the searched
 * string (case-insensitive).
 *
 * @param choices List of choices, as {value, text} objects or plain strings
 * @param search Searched string
 * @returns Values of the matching choices
 */
const matchChoices = (choices: any[], search: string): any[] => {
  const lowerSearch = search.toLowerCase();
  return choices
    .filter((choice: any) => {
      const text = typeof choice === 'string' ? choice : choice?.text;
      return (
        typeof text === 'string' && text.toLowerCase().includes(lowerSearch)
      );
    })
    .map((choice: any) => (typeof choice === 'string' ? choice : choice.value));
};

/**
 * Returns the filters formatted to accommodate the searched string
 *
 * @param search Searched string
 * @param fields List of available fields
 * @param skippedFields List of fields to skip
 * @returns Formatted filter object
 */
export const searchFilters = (
  search: string,
  fields: any[],
  skippedFields: any[] = []
): any => {
  const filters: {
    field: string;
    operator: string;
    value: string | number | boolean | Array<any> | Date;
  }[] = [];
  // Field lists can contain duplicated names (e.g. flattened related
  // subfields present in several places); only emit rules once per field
  const processedFields = new Set<string>();

  fields.forEach((field) => {
    if (
      !field ||
      !field.name ||
      skippedFields.includes(field.name) ||
      processedFields.has(field.name)
    )
      return;
    processedFields.add(field.name);

    // string
    if (TEXT_TYPES.includes(field?.type))
      filters.push({
        field: field.name,
        operator: 'contains',
        value: search,
      });

    // number (decimal covers expression fields displayed as decimal / currency / percent)
    if (
      (['numeric', 'decimal'].includes(field?.type) ||
        field?.name === 'range') &&
      !isNaN(parseFloat(search))
    )
      filters.push({
        field: field.name,
        operator: 'eq',
        value: parseFloat(search),
      });

    // boolean
    if (field?.type === 'boolean') {
      try {
        filters.push({
          field: field.name,
          operator: 'eq',
          value: Boolean(JSON.parse(search)), // allows numerical and textual search (1 / true)
        });
      } catch {
        // cannot be parsed to JSON
      }
    }

    // array
    if (['checkbox', 'tagbox'].includes(field?.type)) {
      filters.push({
        field: field.name,
        operator: 'contains',
        value: [search],
      });
    }

    // people: records store the person object(s) (firstname, lastname,
    // emailaddress...); the backend searches those subfields
    if (['people-dropdown', 'people-tagbox'].includes(field?.type)) {
      filters.push({
        field: field.name,
        operator: 'contains',
        value: search,
      });
    }

    // file: records store an array of file objects; the backend matches the
    // file names, which is what the grid displays
    if (field?.type === 'file') {
      filters.push({
        field: field.name,
        operator: 'contains',
        value: search,
      });
    }

    // choices: also match the search against the DISPLAY text of the
    // choices (users see the label, not the stored value), and look for
    // records holding any of the matching values. Choices coming from
    // URL / GraphQL APIs are already resolved (and cached) into `choices`
    // by GridService.populateMetaFields.
    if (CHOICE_TYPES.includes(field?.type)) {
      const choices = field?.choices ?? field?.meta?.choices;
      if (Array.isArray(choices) && choices.length) {
        const matchedValues = matchChoices(choices, search);
        if (matchedValues.length) {
          filters.push({
            field: field.name,
            operator: 'in',
            value: matchedValues,
          });
        }
      }
    }

    // date
    if (['date', 'datetime', 'datetime-local'].includes(field?.type)) {
      // Only emit a date rule for complete ISO dates — otherwise
      // getDateForMongo() yields invalid dates that serialize to null and
      // turn `$gte/$lte: null` into "match every record where this field is
      // missing", which would expand the global-search $or to basically
      // every document. Date.parse alone is too lenient: V8 parses partial
      // strings like '2025-' or '12' as valid dates, polluting the search
      // with meaningless date matches.
      const parsed = Date.parse(search);
      if (!isNaN(parsed) && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(search)) {
        filters.push({
          field: field.name,
          operator: 'eq',
          value: search,
        });
      }
    }
  });

  return filters;
};

export default searchFilters;
