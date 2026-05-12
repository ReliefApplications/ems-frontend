import { Model, Serializer } from 'survey-core';
import {
  fireOnRecordEditionTriggers,
  ON_RECORD_EDITION_TRIGGER_TYPE,
  registerOnRecordEditionTrigger,
  SurveyTriggerOnRecordEdition,
} from './on-record-edition.trigger';

describe('onrecordeditiontrigger', () => {
  beforeAll(() => {
    registerOnRecordEditionTrigger();
  });

  describe('registerOnRecordEditionTrigger', () => {
    it('registers the type with the SurveyJS Serializer', () => {
      expect(Serializer.findClass(ON_RECORD_EDITION_TRIGGER_TYPE)).toBeTruthy();
    });

    it('is idempotent (safe to call twice)', () => {
      expect(() => {
        registerOnRecordEditionTrigger();
        registerOnRecordEditionTrigger();
      }).not.toThrow();
    });

    it('inherits from surveytrigger', () => {
      const cls = Serializer.findClass(ON_RECORD_EDITION_TRIGGER_TYPE);
      expect(cls.parentName).toBe('surveytrigger');
    });

    it('exposes setToName and runExpression properties', () => {
      const propNames = Serializer.getProperties(
        ON_RECORD_EDITION_TRIGGER_TYPE
      ).map((p) => p.name);
      expect(propNames).toEqual(
        expect.arrayContaining(['setToName', 'runExpression'])
      );
    });

    it('hides the inherited condition expression property', () => {
      const expression = Serializer.findProperty(
        ON_RECORD_EDITION_TRIGGER_TYPE,
        'expression'
      );
      expect(expression?.visible).toBe(false);
    });
  });

  describe('SurveyTriggerOnRecordEdition', () => {
    it('reports its custom type name', () => {
      const trigger = new SurveyTriggerOnRecordEdition();
      expect(trigger.getType()).toBe(ON_RECORD_EDITION_TRIGGER_TYPE);
    });

    it('deserializes from survey JSON into the custom class', () => {
      const survey = new Model({
        elements: [{ type: 'text', name: 'target' }],
        triggers: [
          {
            type: ON_RECORD_EDITION_TRIGGER_TYPE,
            setToName: 'target',
            runExpression: "'hello'",
          },
        ],
      });

      expect(survey.triggers).toHaveLength(1);
      expect(survey.triggers[0]).toBeInstanceOf(SurveyTriggerOnRecordEdition);
      expect(survey.triggers[0].getType()).toBe(ON_RECORD_EDITION_TRIGGER_TYPE);
    });
  });

  describe('fireOnRecordEditionTriggers', () => {
    it('runs the expression and assigns the result to setToName', () => {
      const survey = new Model({
        elements: [{ type: 'text', name: 'target' }],
        triggers: [
          {
            type: ON_RECORD_EDITION_TRIGGER_TYPE,
            setToName: 'target',
            runExpression: "'edited'",
          },
        ],
      });

      fireOnRecordEditionTriggers(survey);

      expect(survey.getValue('target')).toBe('edited');
    });

    it('does nothing when runExpression is empty', () => {
      const survey = new Model({
        elements: [{ type: 'text', name: 'target' }],
        triggers: [
          { type: ON_RECORD_EDITION_TRIGGER_TYPE, setToName: 'target' },
        ],
      });

      fireOnRecordEditionTriggers(survey);

      expect(survey.getValue('target')).toBeUndefined();
    });

    it('does nothing when setToName is empty', () => {
      const survey = new Model({
        elements: [{ type: 'text', name: 'target' }],
        triggers: [
          {
            type: ON_RECORD_EDITION_TRIGGER_TYPE,
            runExpression: "'ignored'",
          },
        ],
      });

      expect(() => fireOnRecordEditionTriggers(survey)).not.toThrow();
      expect(survey.getValue('target')).toBeUndefined();
    });

    it('ignores triggers of other types', () => {
      const survey = new Model({
        elements: [{ type: 'text', name: 'target' }],
        triggers: [
          {
            type: 'runexpressiontrigger',
            setToName: 'target',
            runExpression: "'from-builtin'",
            expression: 'true',
          },
        ],
      });
      survey.setValue('target', 'untouched');

      fireOnRecordEditionTriggers(survey);

      // The built-in runexpression trigger is condition-driven and should not
      // be invoked by our helper, so the value remains as we set it.
      expect(survey.getValue('target')).toBe('untouched');
    });

    it('does not fire automatically via the survey expression-evaluation loop', () => {
      const survey = new Model({
        elements: [
          { type: 'text', name: 'gate' },
          { type: 'text', name: 'target' },
        ],
        triggers: [
          {
            type: ON_RECORD_EDITION_TRIGGER_TYPE,
            setToName: 'target',
            runExpression: "'should-not-auto-fire'",
            expression: '{gate} = "go"',
          },
        ],
      });

      // Changing values would normally fire condition-driven triggers
      survey.setValue('gate', 'go');

      expect(survey.getValue('target')).toBeUndefined();
    });
  });
});
