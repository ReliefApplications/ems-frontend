import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import get from 'lodash/get';
import { StorybookTranslateModule } from '../../../../.storybook/storybook-translate.module';
import { DatePipe } from '../../pipes/date/date.pipe';
import { HtmlParserService } from './html-parser.service';
import {
  aggregationFormatElement,
  calcFormatElement,
  customDateFormats,
  dataFormatElement,
  maxMinValues,
  notNumberValueExamples,
  optionFields,
  optionsAggregation,
  optionsData,
  percentageValues,
  predefinedDateFormats,
  roundValues,
} from './html-parser-test-values';

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
  describe('Parse HTML with aggregation data', () => {
    let replaceAggregationData!: any;
    beforeAll(() => {
      replaceAggregationData = jest.spyOn(service, 'replaceAggregationData');
    });
    it('executes replaceAggregationData function', () => {
      service.parseHtml(aggregationFormatElement.before, {});
      expect(replaceAggregationData).toHaveBeenCalled();
    });
    it('executes html element parse with aggregation data correctly', () => {
      const result = service.parseHtml(aggregationFormatElement.before, {
        aggregation: optionsAggregation,
      });
      expect(result).toEqual(aggregationFormatElement.after);
    });
    it('executes html element parse with aggregation data correctly if html does not have any aggregation set', () => {
      const result = service.parseHtml(calcFormatElement.before, {
        aggregation: optionsAggregation,
      });
      expect(result).toEqual(
        calcFormatElement.after.replace(new RegExp('\\n', 'g'), '')
      );
    });
  });
  describe('Parse HTML with injected data', () => {
    let replaceRecordFields!: any;
    beforeAll(() => {
      replaceRecordFields = jest.spyOn(service, 'replaceRecordFields');
    });
    it('executes replaceRecordFields function', () => {
      service.parseHtml(dataFormatElement.before, {
        data: optionsData,
        fields: optionFields,
      });
      expect(replaceRecordFields).toHaveBeenCalled();
    });
    it('executes html element parse with injected data correctly', () => {
      const result = service.parseHtml(dataFormatElement.before, {
        data: optionsData,
        fields: optionFields,
      });
      expect(result).toEqual(dataFormatElement.after);
    });
    it('executes html element parse with injected data correctly if html does not have any data set', () => {
      const result = service.parseHtml(calcFormatElement.before, {
        data: optionsData,
        fields: optionFields,
      });
      expect(result).toEqual(
        calcFormatElement.after.replace(new RegExp('\\n', 'g'), '')
      );
    });
  });
  describe('Parse HTML with context data', () => {
    let replaceRecordFields!: any;
    beforeAll(() => {
      replaceRecordFields = jest.spyOn(service, 'replaceRecordFields');
    });
    it('executes replaceRecordFields function', () => {
      service.parseHtml(dataFormatElement.before, {
        data: optionsData,
        fields: optionFields,
      });
      expect(replaceRecordFields).toHaveBeenCalled();
    });
    it('executes html element parse with injected data correctly', () => {
      const result = service.parseHtml(dataFormatElement.before, {
        data: optionsData,
        fields: optionFields,
      });
      expect(result).toEqual(dataFormatElement.after);
    });
    it('executes html element parse with injected data correctly if html does not have any data set', () => {
      const result = service.parseHtml(calcFormatElement.before, {
        data: optionsData,
        fields: optionFields,
      });
      expect(result).toEqual(
        calcFormatElement.after.replace(new RegExp('\\n', 'g'), '')
      );
    });
  });
});
