import {
  Serializer,
  SurveyModel,
  SurveyTriggerRunExpression,
} from 'survey-core';
import { editorLocalization } from 'survey-creator-core';

/** Type name registered with the SurveyJS Serializer. */
export const ON_RECORD_EDITION_TRIGGER_TYPE = 'onrecordeditiontrigger';

/**
 * Trigger that runs once when the survey is opened to edit an existing record.
 *
 * Unlike the built-in `runexpression` trigger, it is not driven by a condition
 * expression — `canBeExecuted` always returns `false` so the survey's normal
 * expression-evaluation loop will never fire it. Instead, the host component
 * (e.g. form-modal) calls {@link fireOnRecordEditionTriggers} once after the
 * record data has been loaded into the survey.
 */
export class SurveyTriggerOnRecordEdition extends SurveyTriggerRunExpression {
  /**
   * Identifier used by the SurveyJS Serializer to (de)serialize this trigger.
   *
   * @returns The serializer type name of this trigger
   */
  override getType(): string {
    return ON_RECORD_EDITION_TRIGGER_TYPE;
  }

  /**
   * Disable the survey's normal condition-driven evaluation for this trigger.
   * It is fired manually via {@link fireOnRecordEditionTriggers}.
   *
   * @returns Always false
   */
  protected override canBeExecuted(): boolean {
    return false;
  }

  /**
   * Run the trigger's `runExpression` and, if `setToName` is set, assign the
   * result to that question/variable.
   *
   * @param survey Survey to run the expression against
   */
  public fire(survey: SurveyModel): void {
    if (!this.runExpression) return;
    const result = survey.runExpression(this.runExpression);
    if (this.setToName) {
      survey.setValue(this.setToName, result);
    }
  }
}

/**
 * Register the custom trigger class with the SurveyJS Serializer so it appears
 * in the trigger-type dropdown and survives JSON (de)serialization.
 */
export const registerOnRecordEditionTrigger = (): void => {
  if (Serializer.findClass(ON_RECORD_EDITION_TRIGGER_TYPE)) return;

  Serializer.addClass(
    ON_RECORD_EDITION_TRIGGER_TYPE,
    [
      // The base `trigger` class declares `expression:condition`, but this
      // trigger is not condition-driven — hide it from the property grid.
      { name: 'expression', visible: false },
      { name: 'setToName:questionvalue' },
      'runExpression:expression',
    ],
    () => new SurveyTriggerOnRecordEdition(),
    'surveytrigger'
  );

  // Label shown in the trigger-type dropdown of the Survey Creator
  const editorEn = editorLocalization.getLocale('en');
  editorEn.triggers = editorEn.triggers || {};
  editorEn.triggers[ON_RECORD_EDITION_TRIGGER_TYPE] = 'On record edition';
  const editorFr = editorLocalization.getLocale('fr');
  editorFr.triggers = editorFr.triggers || {};
  editorFr.triggers[ON_RECORD_EDITION_TRIGGER_TYPE] =
    "À l'édition d'un enregistrement";
};

/**
 * Fire all `onrecordeditiontrigger` instances on the survey exactly once.
 * Intended to be called by the host component after the existing record's data
 * has been loaded into the survey.
 *
 * @param survey Survey instance
 */
export const fireOnRecordEditionTriggers = (survey: SurveyModel): void => {
  survey.triggers
    .filter((t) => t.getType() === ON_RECORD_EDITION_TRIGGER_TYPE)
    .forEach((t) => (t as SurveyTriggerOnRecordEdition).fire(survey));
};
