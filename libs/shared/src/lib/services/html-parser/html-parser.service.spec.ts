import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import get from 'lodash/get';
import { StorybookTranslateModule } from '../../../../.storybook/storybook-translate.module';
import { DatePipe } from '../../pipes/date/date.pipe';
import { HtmlParserService } from './html-parser.service';

/** Not number value examples */
const notNumberValueExamples = [
  'a',
  '?',
  '/',
  '%%',
  '#',
  '&(',
  ')',
  '|\\',
  '.',
  ',',
  ';',
];

/**
 * Hardcoded values for round func test cases
 * - [initial value, expected value, precision level]
 */
const roundValues = {
  regular: [
    ['1.49', '1'],
    ['1.49', '1.5', '1'],
  ],
  up: [
    ['1.49', '2'],
    ['1.511', '1.52', '2'],
  ],
  down: [
    ['1.49', '1'],
    ['1.555', '1.55', '2'],
  ],
};
/**
 * Hardcoded values for percentage func test cases
 * - [initial value, total value, expected value, precision level]
 */
const percentageValues = [
  ['50.04', '100', '50.04%'],
  ['5', '1', '500%', '0'],
  ['50.6', '100', '51%', '0'],
];
/**
 * Hardcoded values for max/min func test cases
 * - [expected value, ...values]
 */
const maxMinValues = {
  max: [
    ['1.501', '1', '1.01', '1.500', '1.501'],
    ['1.49', '1.48', '1.0', '1', '0.54'],
  ],
  min: [
    ['1', '1', '1.01', '1.500', '1.501'],
    ['0.54', '1.48', '1.0', '1', '0.54'],
  ],
};
/** Custom date formats */
const customDateFormats = [
  { format: 'yyyy-MM-dd', result: `2024-11-26` }, // 2024-11-26: ISO 8601 format date
  { format: 'dd/MM/yyyy', result: `26/11/2024` }, // 26/11/2024: Day-first numeric format
  { format: 'MM/dd/yyyy', result: `11/26/2024` }, // 11/26/2024: Month-first numeric format
  {
    format: 'EEEE, MMMM d, yyyy',
    result: `Tuesday, November 26, 2024`,
  }, // Tuesday, November 26, 2024: Full day name, month name, day, year
  {
    format: 'MMM d, y, h:mm a',
    result: `Nov 26, 2024, 1:00 PM`,
  }, // Nov 26, 2024, 1:00 PM: Short month name, day, year, 12-hour time
  {
    format: "MMMM d, y 'at' h:mm a",
    result: `November 26, 2024 at 1:00 PM`,
  }, // November 26, 2024 at 1:00 PM: Full month, day, year with literal text
  {
    format: 'yyyy/MM/dd HH:mm:ss Z',
    result: `2024/11/26 13:00:00 +0100`,
  }, // 2024/11/26 1:00:00 +0000: ISO-like with timezone offset
  {
    format: 'yyyy-MM-ddTHH:mm:ss',
    result: `2024-11-26T13:00:00`,
  }, // 2024-11-26T1:00:00: ISO 8601 with "T" separator for time
  { format: 'hh:mm a', result: `01:00 PM` }, // 1:00 PM: 12-hour time with AM/PM
  { format: 'HH:mm:ss', result: `13:00:00` }, // 1:00:00: 24-hour time with seconds
  { format: 'MMMM d', result: `November 26` }, // November 26: Full month name and day (no year)
  { format: 'E, MMM dd yyyy', result: `Tue, Nov 26 2024` }, // Tue, Nov 26 2024: Short day name, short month, day, year
  { format: 'yyyy MMMM dd', result: `2024 November 26` }, // 2024 November 26: Year, full month name, day
  {
    format: 'yyyy-MM-dd HH:mm',
    result: `2024-11-26 13:00`,
  }, // 2024-11-26 1:00: ISO-like date with hours and minutes
  { format: 'dd-MMM-yyyy', result: `26-Nov-2024` }, // 26-Nov-2024: Day, short month name, year
  { format: 'MM/yyyy', result: `11/2024` }, // 11/2024: Month and year only
  {
    format: 'HH:mm:ss.SSS',
    result: `13:00:00.000`,
  }, // 1:00:00.000: 24-hour time with milliseconds
  {
    format: 'EEE, d MMM yyyy HH:mm:ss Z',
    result: `Tue, 26 Nov 2024 13:00:00 +0100`,
  }, // Tue, 26 Nov 2024 1:00:00 +0000: RFC 2822 format (emails)
  {
    format: 'yyyy-MM-dd HH:mm:ss zzzz',
    result: `2024-11-26 13:00:00 GMT+01:00`,
  }, // 2024-11-26 1:00:00 GMT+01:00: Full timezone name
  {
    format: 'h:mm:ss a z',
    result: `1:00:00 PM GMT+1`,
  }, // 12:00:00 PM GMT: 12-hour time with seconds and timezone abbreviation
  { format: 'G yyyy-MM-dd', result: 'AD 2024-11-26' }, // AD 2024-11-26: Era designator (AD/BC), year, month, day
];
/** Predefined formats */
const predefinedDateFormats = [
  {
    format: 'short',
    result: `11/26/24, 1:00 PM`,
  }, // Example: 11/26/24, 1:00 PM
  {
    format: 'medium',
    result: `Nov 26, 2024, 1:00:00 PM`,
  }, // Example: Nov 26, 2024, 1:00:00 PM
  {
    format: 'long',
    result: `November 26, 2024 at 1:00:00 PM GMT+1`,
  }, // Example: November 26, 2024 at 1:00:00 PM GMT+1
  {
    format: 'full',
    result: `Tuesday, November 26, 2024 at 1:00:00 PM GMT+01:00`,
  }, // Example: Tuesday, November 26, 2024 at 1:00:00 PM GMT+01:00
  { format: 'shortDate', result: '11/26/24' }, // Example: 11/26/24
  { format: 'mediumDate', result: 'Nov 26, 2024' }, // Example: Nov 26, 2024
  { format: 'longDate', result: 'November 26, 2024' }, // Example: November 26, 2024
  {
    format: 'fullDate',
    result: 'Tuesday, November 26, 2024',
  }, // Example: Tuesday, November 26, 2024
  { format: 'shortTime', result: `1:00 PM` }, // Example: 1:00 PM
  {
    format: 'mediumTime',
    result: `1:00:00 PM`,
  }, // Example: 1:00:00 PM
  {
    format: 'longTime',
    result: `1:00:00 PM GMT+1`,
  }, // Example: 1:00:00 PM GMT
  {
    format: 'fullTime',
    result: `1:00:00 PM GMT+01:00`,
  }, // Example: 1:00:00 PM GMT+00:00
];
/** Html with calc functions */
const calcFormatElement = {
  before: `
<p>{{calc.round( 9.5 ; 1 )}}</p>
<p>{{calc.roundup( 9.5 ; 1 )}}</p>
<p>{{calc.rounddown( 9.5 ; 1 )}}</p>
<p>{{calc.percentage( 5 ; 10 ; 0 )}}</p>
<p>{{calc.min( 1 ; 2 ; 3 )}}</p>
<p>{{calc.max( 3 ; 2 ; 1 )}}</p>
<p>{{calc.date( Tuesday, November 26, 2024 ; shortDate )}}</p>
`,
  after: `
<p>9.5</p>
<p>9.5</p>
<p>9.5</p>
<p>50%</p>
<p>1</p>
<p>3</p>
<p>11/26/24</p>
`,
};

describe('HtmlParserService', () => {
  let service: HtmlParserService;
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StorybookTranslateModule],
      providers: [DatePipe],
    });
    service = TestBed.inject(HtmlParserService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('Calculations with hardcoded data', () => {
    let roundFunc!: any;
    let roundUpFunc!: any;
    let roundDownFunc!: any;
    let percentageFunc!: any;
    let minFunc!: any;
    let maxFunc!: any;
    let dateFunc!: any;
    beforeAll(() => {
      roundFunc = get(service.calcFunctions, 'round');
      roundUpFunc = get(service.calcFunctions, 'roundup');
      roundDownFunc = get(service.calcFunctions, 'rounddown');
      percentageFunc = get(service.calcFunctions, 'percentage');
      minFunc = get(service.calcFunctions, 'min');
      maxFunc = get(service.calcFunctions, 'max');
      dateFunc = get(service.calcFunctions, 'date');
    });
    /** Round functions */
    describe('executes round calculations correctly', () => {
      let currentRoundFunction!: any;
      Object.keys(roundValues).forEach((key) => {
        describe(`executes ${key} round calculations correctly`, () => {
          beforeEach(() => {
            switch (key) {
              case 'up':
                currentRoundFunction = roundUpFunc;
                break;
              case 'down':
                currentRoundFunction = roundDownFunc;
                break;
              default:
                currentRoundFunction = roundFunc;
                break;
            }
          });
          roundValues[key as keyof typeof roundValues].forEach((testCases) => {
            it(`and rounds ${testCases[0]} to ${testCases[1]} if precision level is ${testCases[2]}`, () => {
              const result = currentRoundFunction.call(
                testCases[0],
                testCases[2]
              );
              expect(result).toBe(testCases[1]);
            });
          });
        });
      });
    });
    describe('handles round calculation errors gracefully', () => {
      let currentRoundFunction!: any;
      Object.keys(roundValues).forEach((key) => {
        describe(`handles ${key} round calculation errors gracefully`, () => {
          beforeEach(() => {
            switch (key) {
              case 'up':
                currentRoundFunction = roundUpFunc;
                break;
              case 'down':
                currentRoundFunction = roundDownFunc;
                break;
              default:
                currentRoundFunction = roundFunc;
                break;
            }
          });
          const noNumberValue =
            notNumberValueExamples[
              Math.floor(notNumberValueExamples.length * Math.random())
            ];
          it(`and rounds not number value ${noNumberValue} to '0'`, () => {
            const result = currentRoundFunction.call(noNumberValue);
            expect(result).toBe('0');
          });
          it(`and rounds no value to '0'`, () => {
            const result = currentRoundFunction.call();
            expect(result).toBe('0');
          });
        });
      });
    });
    /** Percentage function */
    describe('executes percentage calculation correctly', () => {
      percentageValues.forEach((testCases) => {
        it(`sets percentage of ${testCases[0]} against ${testCases[1]} is ${testCases[2]} if precision level is ${testCases[3]}`, () => {
          const result = percentageFunc.call(
            testCases[0],
            testCases[1],
            testCases[3]
          );
          expect(result).toBe(testCases[2]);
        });
      });
    });
    describe('handles percentage calculation errors gracefully', () => {
      const noNumberValue =
        notNumberValueExamples[
          Math.floor(notNumberValueExamples.length * Math.random())
        ];
      it(`and sets percentage of not number value ${noNumberValue} to '0'`, () => {
        const result = percentageFunc.call(noNumberValue);
        expect(result).toBe('0');
      });
      it(`and sets percentage of no value to '0'`, () => {
        const result = percentageFunc.call();
        expect(result).toBe('0');
      });
    });
    /** Max/Min functions */
    describe('executes max/min calculations correctly', () => {
      let currentFunction!: any;
      Object.keys(maxMinValues).forEach((key) => {
        describe(`executes ${key} value calculations correctly`, () => {
          beforeEach(() => {
            switch (key) {
              case 'max':
                currentFunction = maxFunc;
                break;
              case 'min':
                currentFunction = minFunc;
                break;
              default:
                break;
            }
          });
          maxMinValues[key as keyof typeof maxMinValues].forEach(
            (testCases) => {
              it(`and ${key} value from ${testCases.join(', ')} is ${
                testCases[0]
              }`, () => {
                const result = currentFunction.call(testCases[0], ...testCases);
                expect(result).toBe(testCases[0]);
              });
            }
          );
        });
      });
    });
    describe('handles max/min calculation errors gracefully', () => {
      let currentFunction!: any;
      Object.keys(maxMinValues).forEach((key) => {
        describe(`handles ${key} value calculation errors gracefully`, () => {
          beforeEach(() => {
            switch (key) {
              case 'max':
                currentFunction = maxFunc;
                break;
              case 'min':
                currentFunction = minFunc;
                break;
              default:
                break;
            }
          });
          it(`and sets ${key} value from not number values ${notNumberValueExamples.join(
            ', '
          )} to an empty string`, () => {
            const result = currentFunction.call(...notNumberValueExamples);
            expect(result).toBe('');
          });
          it(`and sets ${key} value from no value to be an empty string`, () => {
            const result = currentFunction.call();
            expect(result).toBe('');
          });
        });
      });
    });
    /** Date function */
    describe('executes date calculation correctly', () => {
      const fixedDate = new Date(
        Date.UTC(2024, 10, 26, 12, 0, 0)
      ).toISOString();
      [...customDateFormats, ...predefinedDateFormats].forEach((testCase) => {
        it(`sets given ${fixedDate} date with format ${testCase.format} to ${testCase.result}`, () => {
          const result = dateFunc.call(fixedDate, testCase.format);
          expect(result).toBe(testCase.result);
        });
      });
    });
    describe('handles date calculation errors gracefully', () => {
      const noNumberValue =
        notNumberValueExamples[
          Math.floor(notNumberValueExamples.length * Math.random())
        ];
      const fixedDate = new Date(
        Date.UTC(2024, 10, 26, 12, 0, 0)
      ).toISOString();
      it(`and sets given not date format ${noNumberValue} to same ${noNumberValue}`, () => {
        const result = dateFunc.call(fixedDate, noNumberValue);
        expect(result).toBe(noNumberValue);
      });
      it(`and sets no value to ''`, () => {
        const result = dateFunc.call();
        expect(result).toBe('');
      });
    });
  });
  describe('Parse HTML with calculations data', () => {
    let roundFunc!: any;
    let roundUpFunc!: any;
    let roundDownFunc!: any;
    let percentageFunc!: any;
    let minFunc!: any;
    let maxFunc!: any;
    let dateFunc!: any;
    beforeAll(() => {
      roundFunc = jest.spyOn(get(service.calcFunctions, 'round'), 'call');
      roundUpFunc = jest.spyOn(get(service.calcFunctions, 'roundup'), 'call');
      roundDownFunc = jest.spyOn(
        get(service.calcFunctions, 'rounddown'),
        'call'
      );
      percentageFunc = jest.spyOn(
        get(service.calcFunctions, 'percentage'),
        'call'
      );
      minFunc = jest.spyOn(get(service.calcFunctions, 'min'), 'call');
      maxFunc = jest.spyOn(get(service.calcFunctions, 'max'), 'call');
      dateFunc = jest.spyOn(get(service.calcFunctions, 'date'), 'call');
    });
    it('executes calc function for round', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(roundFunc).toHaveBeenCalled();
    });
    it('executes calc function for roundup', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(roundUpFunc).toHaveBeenCalled();
    });
    it('executes calc function for rounddown', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(roundDownFunc).toHaveBeenCalled();
    });
    it('executes calc function for percentage', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(percentageFunc).toHaveBeenCalled();
    });
    it('executes calc function for max', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(maxFunc).toHaveBeenCalled();
    });
    it('executes calc function for min', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(minFunc).toHaveBeenCalled();
    });
    it('executes calc function for date', () => {
      service.parseHtml(calcFormatElement.before, {});
      expect(dateFunc).toHaveBeenCalled();
    });
    it('executes html element parse with calcs correctly', () => {
      const result = service.parseHtml(calcFormatElement.before, {});
      expect(result).toEqual(calcFormatElement.after);
    });
  });
});
