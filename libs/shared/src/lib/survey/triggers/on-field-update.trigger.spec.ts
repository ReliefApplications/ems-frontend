import { Model, Serializer } from 'survey-core';
import {
  EmptySurveyCreatorOptions,
  PropertyGridEditorCollection,
} from 'survey-creator-core';
import {
  captureOnFieldUpdateInitialData,
  fireOnFieldUpdateTriggers,
  fireOnFieldUpdateTriggersForRecordUpdate,
  ON_FIELD_UPDATE_TRIGGER_TYPE,
  registerOnFieldUpdateTrigger,
  SurveyTriggerOnFieldUpdate,
} from './on-field-update.trigger';

describe('onfieldupdatetrigger', () => {
  beforeAll(() => {
    registerOnFieldUpdateTrigger();
  });

  describe('registerOnFieldUpdateTrigger', () => {
    it('registers the type with the SurveyJS Serializer', () => {
      expect(Serializer.findClass(ON_FIELD_UPDATE_TRIGGER_TYPE)).toBeTruthy();
    });

    it('is idempotent (safe to call twice)', () => {
      expect(() => {
        registerOnFieldUpdateTrigger();
        registerOnFieldUpdateTrigger();
      }).not.toThrow();
    });

    it('inherits from surveytrigger', () => {
      const cls = Serializer.findClass(ON_FIELD_UPDATE_TRIGGER_TYPE);
      expect(cls.parentName).toBe('surveytrigger');
    });

    it('exposes sourceQuestions, setToName, and setValue properties', () => {
      const propNames = Serializer.getProperties(
        ON_FIELD_UPDATE_TRIGGER_TYPE
      ).map((p) => p.name);
      expect(propNames).toEqual(
        expect.arrayContaining(['sourceQuestions', 'setToName', 'setValue'])
      );
    });

    it('hides the inherited condition expression property', () => {
      const expression = Serializer.findProperty(
        ON_FIELD_UPDATE_TRIGGER_TYPE,
        'expression'
      );
      expect(expression?.visible).toBe(false);
    });

    it('renders monitored fields as checkbox choices', () => {
      const survey = createSurvey(['source']);
      const prop = Serializer.findProperty(
        ON_FIELD_UPDATE_TRIGGER_TYPE,
        'sourceQuestions'
      );
      const editor = PropertyGridEditorCollection.getEditor(prop);
      const editorJson = editor.getJSON(
        survey.triggers[0],
        prop,
        new EmptySurveyCreatorOptions()
      );

      expect(editorJson.type).toBe('checkbox');
      expect(editorJson.choices).toEqual(
        expect.arrayContaining([
          { value: 'source', text: 'source' },
          { value: 'target', text: 'target' },
        ])
      );
    });
  });

  describe('SurveyTriggerOnFieldUpdate', () => {
    it('reports its custom type name', () => {
      const trigger = new SurveyTriggerOnFieldUpdate();
      expect(trigger.getType()).toBe(ON_FIELD_UPDATE_TRIGGER_TYPE);
    });

    it('deserializes from survey JSON into the custom class', () => {
      const survey = new Model({
        elements: [
          { type: 'text', name: 'source' },
          { type: 'boolean', name: 'target' },
        ],
        triggers: [
          {
            type: ON_FIELD_UPDATE_TRIGGER_TYPE,
            sourceQuestions: ['source'],
            setToName: 'target',
            setValue: true,
          },
        ],
      });

      expect(survey.triggers).toHaveLength(1);
      expect(survey.triggers[0]).toBeInstanceOf(SurveyTriggerOnFieldUpdate);
      expect(survey.triggers[0].getType()).toBe(ON_FIELD_UPDATE_TRIGGER_TYPE);
    });
  });

  describe('fireOnFieldUpdateTriggers', () => {
    it('sets the target value when a monitored field changes', () => {
      const survey = createSurvey(['source']);
      survey.data = { source: 'original', target: false };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('source', 'updated');
      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(true);
    });

    it('does not run for new record creation saves', () => {
      const survey = createSurvey(['source']);
      survey.data = { target: false };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('source', 'created value');
      fireOnFieldUpdateTriggersForRecordUpdate(survey, false);

      expect(survey.getValue('target')).toBe(false);
    });

    it('runs for existing record update saves', () => {
      const survey = createSurvey(['source']);
      survey.data = { source: 'original', target: false };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('source', 'updated');
      fireOnFieldUpdateTriggersForRecordUpdate(survey, true);

      expect(survey.getValue('target')).toBe(true);
    });

    it('does not set the target value when the monitored field is unchanged', () => {
      const survey = createSurvey(['source']);
      survey.data = { source: 'original', target: false };
      captureOnFieldUpdateInitialData(survey);

      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(false);
    });

    it('does not set the target value when the user reverts to the original value', () => {
      const survey = createSurvey(['source']);
      survey.data = { source: 'original', target: false };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('source', 'updated');
      survey.setValue('source', 'original');
      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(false);
    });

    it('supports multiple monitored fields', () => {
      const survey = createSurvey(['sourceA', 'sourceB']);
      survey.data = { sourceA: 'A', sourceB: 'B', target: false };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('sourceB', 'updated');
      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(true);
    });

    it('detects removed document upload values', () => {
      const survey = createDocumentSurvey();
      survey.data = {
        document: [
          {
            name: 'original.pdf',
            type: 'application/pdf',
            content: { driveId: 'drive-1', itemId: 'item-1' },
          },
        ],
        target: false,
      };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('document', []);
      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(true);
    });

    it('detects replaced document upload values', () => {
      const survey = createDocumentSurvey();
      survey.data = {
        document: [
          {
            name: 'original.pdf',
            type: 'application/pdf',
            content: { driveId: 'drive-1', itemId: 'item-1' },
          },
        ],
        target: false,
      };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('document', [
        {
          name: 'replacement.pdf',
          type: 'application/pdf',
          content: { driveId: 'drive-1', itemId: 'item-2' },
        },
      ]);
      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(true);
    });

    it('ignores transient file objects on unchanged document values', () => {
      const survey = createDocumentSurvey();
      survey.data = {
        document: [
          {
            name: 'original.pdf',
            type: 'application/pdf',
            content: { driveId: 'drive-1', itemId: 'item-1' },
          },
        ],
        target: false,
      };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('document', [
        {
          name: 'original.pdf',
          type: 'application/pdf',
          content: { itemId: 'item-1', driveId: 'drive-1' },
          file: { name: 'original.pdf' },
        },
      ]);
      fireOnFieldUpdateTriggers(survey);

      expect(survey.getValue('target')).toBe(false);
    });

    it('does not fire automatically through SurveyJS condition evaluation', () => {
      const survey = createSurvey(['source']);
      survey.data = { source: 'original' };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('source', 'updated');

      expect(survey.getValue('target')).toBeUndefined();
    });

    it('ignores triggers without a target question', () => {
      const survey = new Model({
        elements: [{ type: 'text', name: 'source' }],
        triggers: [
          {
            type: ON_FIELD_UPDATE_TRIGGER_TYPE,
            sourceQuestions: ['source'],
            setValue: true,
          },
        ],
      });
      survey.data = { source: 'original' };
      captureOnFieldUpdateInitialData(survey);

      survey.setValue('source', 'updated');

      expect(() => fireOnFieldUpdateTriggers(survey)).not.toThrow();
    });
  });
});

/**
 * Creates a survey with the On Field Update trigger.
 *
 * @param sourceNames Monitored source fields
 * @returns Survey model
 */
const createSurvey = (sourceNames: string[]): Model =>
  new Model({
    elements: [
      { type: 'text', name: 'source' },
      { type: 'text', name: 'sourceA' },
      { type: 'text', name: 'sourceB' },
      { type: 'boolean', name: 'target' },
    ],
    triggers: [
      {
        type: ON_FIELD_UPDATE_TRIGGER_TYPE,
        sourceQuestions: sourceNames,
        setToName: 'target',
        setValue: true,
      },
    ],
  });

/**
 * Creates a survey with a monitored document upload field.
 *
 * @returns Survey model
 */
const createDocumentSurvey = (): Model =>
  new Model({
    elements: [
      { type: 'file', name: 'document' },
      { type: 'boolean', name: 'target' },
    ],
    triggers: [
      {
        type: ON_FIELD_UPDATE_TRIGGER_TYPE,
        sourceQuestions: ['document'],
        setToName: 'target',
        setValue: true,
      },
    ],
  });
