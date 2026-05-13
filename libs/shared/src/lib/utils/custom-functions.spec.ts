import { FunctionFactory, SurveyModel } from 'survey-core';
import { AuthService } from '../services/auth/auth.service';
import addCustomFunctions from './custom-functions';

/**
 * Build a survey-like mock exposing the methods the custom functions rely on.
 *
 * @param overrides Partial survey overrides
 * @param overrides.record Record returned by getPropertyValue('record')
 * @param overrides.questions Map of question name to question mock
 * @returns Object usable as `this.survey` inside a custom function
 */
const createSurveyMock = (overrides: {
  record?: Record<string, unknown>;
  questions?: Record<string, unknown>;
}): SurveyModel => {
  const { record, questions = {} } = overrides;
  return {
    record,
    getPropertyValue: (name: string) =>
      name === 'record' ? record : undefined,
    getQuestionByName: (name: string) => questions[name],
  } as unknown as SurveyModel;
};

/**
 * Helper that invokes a registered custom function with the survey bound to
 * `this`, matching how survey-core actually calls these functions at runtime.
 *
 * @param name Function name registered with FunctionFactory
 * @param params Parameters passed to the function
 * @param survey Survey mock used as `this.survey`
 * @returns Function return value
 */
const runFn = (name: string, params: any[], survey?: SurveyModel) =>
  FunctionFactory.Instance.run(name, params, survey ? { survey } : undefined);

describe('addCustomFunctions', () => {
  const authServiceMock = {
    userValue: { name: 'Test User' },
  } as Partial<AuthService> as AuthService;

  beforeEach(() => {
    addCustomFunctions(authServiceMock);
  });

  it('registers all expected functions', () => {
    const expected = [
      'createdAt',
      'modifiedAt',
      'createdBy',
      'id',
      'incrementalId',
      'displayValue',
      'weekday',
      'addDays',
      'listRowsWithColValue',
      'listColsForRows',
      'nl2br',
      'intersect',
      'getMatrixTitles',
      'length',
      'parse',
      'now',
    ];
    expected.forEach((name) => {
      expect(FunctionFactory.Instance.hasFunction(name)).toBe(true);
    });
  });

  it('re-registering replaces existing functions without throwing', () => {
    expect(() => addCustomFunctions(authServiceMock)).not.toThrow();
  });

  describe('createdAt', () => {
    it('returns the record creation date when available', () => {
      const timestamp = Date.UTC(2024, 0, 15);
      const survey = createSurveyMock({ record: { createdAt: timestamp } });
      const result = runFn('createdAt', [], survey) as Date;
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(timestamp);
    });

    it('returns the current date when no record is set', () => {
      const survey = createSurveyMock({});
      const before = Date.now();
      const result = runFn('createdAt', [], survey) as Date;
      const after = Date.now();
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('modifiedAt', () => {
    it('returns the record modification date when available', () => {
      const timestamp = Date.UTC(2024, 5, 1);
      const survey = createSurveyMock({ record: { modifiedAt: timestamp } });
      const result = runFn('modifiedAt', [], survey) as Date;
      expect(result.getTime()).toBe(timestamp);
    });

    it('returns the current date when no record is set', () => {
      const survey = createSurveyMock({});
      const result = runFn('modifiedAt', [], survey) as Date;
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('createdBy', () => {
    it('returns the record creator name when a record exists', () => {
      const survey = createSurveyMock({
        record: { createdBy: { name: 'Alice' } },
      });
      expect(runFn('createdBy', [], survey)).toBe('Alice');
    });

    it('returns an empty string when the record creator has no name', () => {
      const survey = createSurveyMock({ record: { createdBy: {} } });
      expect(runFn('createdBy', [], survey)).toBe('');
    });

    it('falls back to the auth service user name when no record exists', () => {
      const survey = createSurveyMock({});
      expect(runFn('createdBy', [], survey)).toBe('Test User');
    });
  });

  describe('id', () => {
    it('returns the record id when available', () => {
      const survey = createSurveyMock({ record: { id: 'rec-123' } });
      expect(runFn('id', [], survey)).toBe('rec-123');
    });

    it('returns "unknown id" when no record is set', () => {
      const survey = createSurveyMock({});
      expect(runFn('id', [], survey)).toBe('unknown id');
    });
  });

  describe('incrementalId', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => undefined);
    });

    it('returns the record incrementalId when available', () => {
      const survey = createSurveyMock({ record: { incrementalId: 'INC-42' } });
      expect(runFn('incrementalId', [], survey)).toBe('INC-42');
    });

    it('returns an empty string when no record is set', () => {
      const survey = createSurveyMock({});
      expect(runFn('incrementalId', [], survey)).toBe('');
    });
  });

  describe('displayValue', () => {
    it('returns the displayValue of the requested question', () => {
      const question = { displayValue: 'France' };
      const survey = createSurveyMock({ questions: { country: question } });
      expect(runFn('displayValue', ['country'], survey)).toBe('France');
    });

    it('returns the joined displayValue for multi-select questions', () => {
      const question = { displayValue: 'France, Spain' };
      const survey = createSurveyMock({ questions: { countries: question } });
      expect(runFn('displayValue', ['countries'], survey)).toBe('France, Spain');
    });

    it('returns an empty string when the question is not found', () => {
      const survey = createSurveyMock({});
      expect(runFn('displayValue', ['missing'], survey)).toBe('');
    });
  });

  describe('weekday', () => {
    it('returns the day index for a given date', () => {
      // 2024-01-15 is a Monday
      expect(runFn('weekday', [new Date(2024, 0, 15)])).toBe(1);
    });
  });

  describe('addDays', () => {
    it('adds the given number of days to a date', () => {
      const start = new Date(2024, 0, 1);
      const result = runFn('addDays', [start, 5]) as Date;
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(6);
    });

    it('supports negative offsets', () => {
      const start = new Date(2024, 0, 10);
      const result = runFn('addDays', [start, -3]) as Date;
      expect(result.getDate()).toBe(7);
    });
  });

  describe('nl2br', () => {
    it('replaces newline characters with <br> tags', () => {
      expect(runFn('nl2br', ['a\nb\nc'])).toBe('a<br>b<br>c');
    });

    it('returns an empty string for falsy input', () => {
      expect(runFn('nl2br', [''])).toBe('');
      expect(runFn('nl2br', [null])).toBe('');
      expect(runFn('nl2br', [undefined])).toBe('');
    });
  });

  describe('intersect', () => {
    it('returns the intersection of two primitive arrays', () => {
      expect(
        runFn('intersect', [
          [1, 2, 3],
          [2, 3, 4],
        ])
      ).toEqual([2, 3]);
    });

    it('uses deep equality for object members', () => {
      const a = [{ x: 1 }, { x: 2 }];
      const b = [{ x: 2 }, { x: 3 }];
      expect(runFn('intersect', [a, b])).toEqual([{ x: 2 }]);
    });

    it('returns an empty array when either input is not an array', () => {
      expect(runFn('intersect', [null, [1]])).toEqual([]);
      expect(runFn('intersect', [[1], 'not-array'])).toEqual([]);
    });
  });

  describe('length', () => {
    it('returns the length of an array', () => {
      expect(runFn('length', [[1, 2, 3]])).toBe(3);
    });

    it('returns 0 for non-array input', () => {
      expect(runFn('length', ['abc'])).toBe(0);
      expect(runFn('length', [null])).toBe(0);
    });
  });

  describe('parse', () => {
    it('parses a valid JSON string', () => {
      expect(runFn('parse', ['{"a":1}'])).toEqual({ a: 1 });
    });

    it('returns an empty string for falsy input', () => {
      expect(runFn('parse', [''])).toBe('');
      expect(runFn('parse', [null])).toBe('');
    });
  });

  describe('now', () => {
    it('returns the current date as an ISO string', () => {
      const before = Date.now();
      const result = runFn('now', []) as string;
      const after = Date.now();
      const parsed = new Date(result).getTime();
      expect(result).toMatch(/T.*Z$/);
      expect(parsed).toBeGreaterThanOrEqual(before);
      expect(parsed).toBeLessThanOrEqual(after);
    });
  });

  describe('listRowsWithColValue', () => {
    it('returns rows whose column matches the requested value', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        rows: [{ value: 'r1' }, { value: 'r2' }, { value: 'r3' }],
        columns: [{ name: 'status' }, { name: 'count' }],
        value: {
          r1: { status: 'ok', count: 1 },
          r2: { status: 'ko', count: 2 },
          r3: { status: 'ok', count: 3 },
        },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(
        runFn('listRowsWithColValue', ['grid', 'status', 'ok'], survey)
      ).toEqual(['r1', 'r3']);
    });

    it('matches rows with empty values when colValue is undefined', () => {
      const matrixQuestion = {
        getType: () => 'matrix',
        rows: [{ value: 'r1' }, { value: 'r2' }],
        columns: [{ name: 'status' }],
        value: { r1: { status: 'ok' } },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listRowsWithColValue', ['grid', 'status'], survey)).toEqual(
        ['r2']
      );
    });

    it('returns an empty array when required params are missing', () => {
      const survey = createSurveyMock({});
      expect(runFn('listRowsWithColValue', [], survey)).toEqual([]);
      expect(
        runFn('listRowsWithColValue', ['grid', undefined], survey)
      ).toEqual([]);
    });

    it('returns an empty array when the question is not a matrix', () => {
      const question = { getType: () => 'text' };
      const survey = createSurveyMock({ questions: { grid: question } });
      expect(
        runFn('listRowsWithColValue', ['grid', 'status', 'ok'], survey)
      ).toEqual([]);
    });

    it('returns an empty array when colName is not a string', () => {
      const matrixQuestion = {
        getType: () => 'matrix',
        rows: [],
        columns: [],
        value: {},
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(
        runFn('listRowsWithColValue', ['grid', 123, 'ok'], survey)
      ).toEqual([]);
    });
  });

  describe('listColsForRows', () => {
    it('formats the values of each requested row using titles', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        cellType: 'text',
        rows: [
          { value: 'r1', text: 'Row One' },
          { value: 'r2', text: 'Row Two' },
        ],
        columns: [
          { name: 'name', title: 'Name', cellType: 'default' },
          { name: 'age', title: 'Age', cellType: 'default' },
        ],
        value: {
          r1: { name: 'Alice', age: 30 },
          r2: { name: 'Bob' },
        },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listColsForRows', ['grid', ['r1', 'r2']], survey)).toBe(
        '[Row One]\nName: Alice, Age: 30\n[Row Two]\nName: Bob'
      );
    });

    it('formats boolean cells using labelTrue/labelFalse', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        cellType: 'text',
        rows: [{ value: 'r1', text: 'Row' }],
        columns: [
          {
            name: 'active',
            title: 'Active',
            cellType: 'boolean',
            labelTrue: 'Yes',
            labelFalse: 'No',
          },
        ],
        value: { r1: { active: true } },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listColsForRows', ['grid', ['r1']], survey)).toBe(
        '[Row]\nActive: Yes'
      );
    });

    it('formats dropdown cells using the option text', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        cellType: 'text',
        rows: [{ value: 'r1', text: 'Row' }],
        columns: [{ name: 'choice', title: 'Choice', cellType: 'dropdown' }],
        value: { r1: { choice: { text: 'Option A', value: 'a' } } },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listColsForRows', ['grid', ['r1']], survey)).toBe(
        '[Row]\nChoice: Option A'
      );
    });

    it('joins file cell names with commas', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        cellType: 'text',
        rows: [{ value: 'r1', text: 'Row' }],
        columns: [{ name: 'files', title: 'Files', cellType: 'file' }],
        value: { r1: { files: [{ name: 'a.pdf' }, { name: 'b.pdf' }] } },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listColsForRows', ['grid', ['r1']], survey)).toBe(
        '[Row]\nFiles: a.pdf, b.pdf'
      );
    });

    it('falls back to the row value when no row title is configured', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        cellType: 'text',
        rows: [{ value: 'r1' }],
        columns: [{ name: 'name', title: 'Name', cellType: 'default' }],
        value: { r1: { name: 'Alice' } },
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listColsForRows', ['grid', ['r1']], survey)).toBe(
        '[r1]\nName: Alice'
      );
    });

    it('returns an empty string when no row has any value', () => {
      const matrixQuestion = {
        getType: () => 'matrixdropdown',
        cellType: 'text',
        rows: [{ value: 'r1', text: 'Row' }],
        columns: [{ name: 'name', title: 'Name', cellType: 'default' }],
        value: {},
      };
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('listColsForRows', ['grid', ['r1']], survey)).toBe('');
    });

    it('returns an empty array when required params are missing', () => {
      const survey = createSurveyMock({});
      expect(runFn('listColsForRows', [], survey)).toEqual([]);
    });

    it('returns an empty array when the question is not a matrix', () => {
      const survey = createSurveyMock({
        questions: { grid: { getType: () => 'text' } },
      });
      expect(runFn('listColsForRows', ['grid', ['r1']], survey)).toEqual([]);
    });
  });

  describe('getMatrixTitles', () => {
    const matrixQuestion = {
      getType: () => 'matrix',
      rows: [
        { value: 'r1', text: 'Row One' },
        { value: 'r2', text: 'Row Two' },
      ],
      columns: [
        { name: 'c1', title: 'Col One' },
        { name: 'c2', title: 'Col Two' },
      ],
    };

    it('returns row titles by default', () => {
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('getMatrixTitles', ['grid', ['r1', 'r2']], survey)).toEqual([
        'Row One',
        'Row Two',
      ]);
    });

    it('returns column titles when isRow is false', () => {
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(
        runFn('getMatrixTitles', ['grid', ['c1', 'c2'], false], survey)
      ).toEqual(['Col One', 'Col Two']);
    });

    it('falls back to the original name when no match exists', () => {
      const survey = createSurveyMock({ questions: { grid: matrixQuestion } });
      expect(runFn('getMatrixTitles', ['grid', ['unknown']], survey)).toEqual([
        'unknown',
      ]);
    });

    it('returns an empty array when required params are missing', () => {
      const survey = createSurveyMock({});
      expect(runFn('getMatrixTitles', [], survey)).toEqual([]);
    });

    it('returns an empty array when the question is not a matrix', () => {
      const survey = createSurveyMock({
        questions: { grid: { getType: () => 'text' } },
      });
      expect(runFn('getMatrixTitles', ['grid', ['r1']], survey)).toEqual([]);
    });
  });
});
