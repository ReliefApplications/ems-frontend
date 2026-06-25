import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { RestService } from '../rest/rest.service';

/**
 * Handle returned by {@link AutoTranslateService.registerAutoTranslation},
 * scoped to a single survey instance. Auto-translation wiring (the
 * onValueChanged subscription, the per-survey debounce / echo state and the
 * dispose cleanup) lives in the service; callers only keep this handle to
 * suppress translation while they populate the survey programmatically.
 */
export interface AutoTranslationHandle {
  /**
   * Run a programmatic data-loading function with auto-translation suppressed
   * so that prefilling / loading an existing record does not trigger
   * translations the user never asked for. Suppression is restored even if the
   * loader throws.
   *
   * @param load Synchronous function that writes values into the survey
   */
  suppressWhile(load: () => void): void;
}

/** Property key under which the per-survey handle is stored on the survey. */
const AUTO_TRANSLATION_HANDLE_KEY = '__autoTranslationHandle';

/**
 * Service to machine-translate user-entered text content and auto-fill
 * SurveyJS form fields from a source field. This is distinct from the app's
 * i18n/localization: it calls the backend translation endpoint (Azure
 * Cognitive Translator) to translate content, not UI labels.
 */
@Injectable({
  providedIn: 'root',
})
export class AutoTranslateService {
  /**
   * Service to machine-translate text content and handle SurveyJS field
   * auto-translation setup.
   *
   * @param restService Shared REST service
   */
  constructor(private restService: RestService) {}

  /**
   * Wire field auto-translation onto a survey instance. Owns the per-survey
   * debounce / echo / source-value state in a closure (the service is a
   * singleton, so this state must not live on the service), registers the
   * onValueChanged handler and patches the survey's dispose() to clear pending
   * timeouts. Replaces the duplicated wiring that previously lived in each
   * form component.
   *
   * Idempotent: calling it again for the same survey returns the existing
   * handle instead of wiring a second handler.
   *
   * @param survey Survey instance to wire auto-translation onto
   * @returns A handle used to suppress translation while loading data
   */
  registerAutoTranslation(survey: SurveyModel): AutoTranslationHandle {
    const host = survey as SurveyModel & Record<string, any>;
    const existing: AutoTranslationHandle | undefined =
      host[AUTO_TRANSLATION_HANDLE_KEY];
    if (existing) {
      return existing;
    }

    /** Pending debounce timeout per target field. */
    const translationTimeouts = new Map<string, any>();
    /** Latest source value per target field, to drop stale translations. */
    const latestTranslationSourceValues = new Map<string, string>();
    /** Value last written by auto-translation per field, for echo cancellation. */
    const autoTranslatedValues = new Map<string, string>();
    /** When true, programmatic value changes do not trigger translation. */
    let suppressed = false;

    survey.onValueChanged.add((sender, options) => {
      if (suppressed) {
        return;
      }
      this.handleFieldTranslation(
        sender,
        options,
        translationTimeouts,
        latestTranslationSourceValues,
        autoTranslatedValues
      );
    });

    // Patch dispose() once so pending debounce timers are cleared with the
    // survey (survey-core has no onDisposed event; this mirrors grid-cleanup).
    if (typeof survey.dispose === 'function') {
      const originalDispose = survey.dispose.bind(survey);
      survey.dispose = (...args: any[]) => {
        translationTimeouts.forEach((timeout) => clearTimeout(timeout));
        translationTimeouts.clear();
        latestTranslationSourceValues.clear();
        autoTranslatedValues.clear();
        return (originalDispose as (...a: any[]) => void)(...args);
      };
    }

    const handle: AutoTranslationHandle = {
      suppressWhile: (load: () => void) => {
        suppressed = true;
        try {
          load();
        } finally {
          suppressed = false;
        }
      },
    };
    host[AUTO_TRANSLATION_HANDLE_KEY] = handle;
    return handle;
  }

  /**
   * Run a programmatic data-loading function with auto-translation suppressed
   * for the given survey. Convenience wrapper so callers do not need to keep
   * the handle returned by {@link registerAutoTranslation}; if the survey has
   * no auto-translation wired, the loader simply runs without suppression.
   *
   * @param survey Survey whose auto-translation should be suppressed
   * @param load Synchronous function that writes values into the survey
   */
  suppressAutoTranslationWhile(survey: SurveyModel, load: () => void): void {
    const handle: AutoTranslationHandle | undefined = (
      survey as SurveyModel & Record<string, any>
    )[AUTO_TRANSLATION_HANDLE_KEY];
    if (handle) {
      handle.suppressWhile(load);
    } else {
      load();
    }
  }

  /**
   * Translate text using the backend translation REST endpoint.
   *
   * @param text Source text to translate
   * @param from BCP-47 source language code (e.g. 'en'). Pass null/undefined for auto-detect.
   * @param to BCP-47 target language code (e.g. 'uk')
   * @param format Explicit text format ('html' or 'plain')
   * @returns Translated text promise
   */
  async translateText(
    text: string,
    from: string | null | undefined,
    to: string,
    format?: 'html' | 'plain'
  ): Promise<string> {
    if (!text || !text.trim()) {
      return '';
    }

    try {
      const response$ = this.restService.post('/translate', {
        text,
        from: from || null,
        to,
        format,
      });

      const result = await firstValueFrom(response$);
      return result?.translation || '';
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }

  /**
   * Deduplicated translation handling logic for SurveyJS fields.
   *
   * @param sender SurveyJS model instance (sender)
   * @param options Changed field options containing name and value
   * @param options.name The name of the field
   * @param options.value The value of the field
   * @param translationTimeouts Map of translation timeouts for debouncing
   * @param latestTranslationSourceValues Map of latest source values for translation to prevent race conditions
   * @param autoTranslatedValues Map of field name to the value last written by auto-translation, used for echo cancellation in two-way (A<->B) bindings
   */
  handleFieldTranslation(
    sender: any,
    options: { name: string; value: any },
    translationTimeouts: Map<string, any>,
    latestTranslationSourceValues: Map<string, string>,
    autoTranslatedValues: Map<string, string>
  ): void {
    // Echo cancellation: when a translation completes we write the result back
    // into the target field, which itself fires onValueChanged. If that target
    // is also a translation source (two-way binding A<->B), the echo would
    // trigger the reverse translation and loop. Skip a change whose value is
    // exactly the one we just wrote programmatically, and consume the marker so
    // a later genuine user edit to the same value still translates.
    if (autoTranslatedValues.get(options.name) === options.value) {
      autoTranslatedValues.delete(options.name);
      return;
    }

    const questions = sender.getAllQuestions();

    // Find any question that has translateField matching the changed question's name (or valueName)
    const targets = questions.filter((q: any) => {
      const fromName = q.getPropertyValue('translateField');
      if (!fromName) return false;
      const sourceQ = sender.getQuestionByName(fromName);
      if (!sourceQ) return false;
      const expectedName = sourceQ.valueName || sourceQ.name;
      return expectedName === options.name && q.getPropertyValue('translateTo');
    });

    if (targets.length === 0) {
      return;
    }

    const sourceValue = options.value;

    for (const target of targets) {
      const targetName = target.name;
      const targetLang = target.getPropertyValue('translateTo');
      const translateIfExpr = target.getPropertyValue('translateIf');

      // Clear any existing timeout for this target field to debounce
      if (translationTimeouts.has(targetName)) {
        clearTimeout(translationTimeouts.get(targetName));
        translationTimeouts.delete(targetName);
      }

      // If source value is empty, clear the target field value
      if (typeof sourceValue !== 'string' || !sourceValue.trim()) {
        latestTranslationSourceValues.delete(targetName);
        sender.clearValue(targetName);
        continue;
      }

      latestTranslationSourceValues.set(targetName, sourceValue);

      // Check translateIf expression if it exists
      if (translateIfExpr) {
        try {
          // Evaluate the SurveyJS expression
          const conditionPassed = sender.runExpression(translateIfExpr);
          if (!conditionPassed) {
            continue;
          }
        } catch (err) {
          console.error(`Error running expression "${translateIfExpr}":`, err);
          continue;
        }
      }

      // Set a new 800ms debounce timeout
      const timeout = setTimeout(async () => {
        try {
          const format = target.getType() === 'editor' ? 'html' : 'plain';
          const translated = await this.translateText(
            sourceValue,
            null, // auto-detect source language
            targetLang,
            format
          );
          const latestValue = latestTranslationSourceValues.get(targetName);
          if (translated && latestValue === sourceValue) {
            // Mark this value as our own write so the resulting onValueChanged
            // is recognized as an echo and does not trigger a reverse
            // translation (see echo cancellation at the top of this method).
            autoTranslatedValues.set(targetName, translated);
            sender.setValue(targetName, translated);
          }
        } catch (error) {
          console.error(
            `Failed to translate ${options.name} to ${targetName}:`,
            error
          );
        } finally {
          translationTimeouts.delete(targetName);
        }
      }, 800);

      translationTimeouts.set(targetName, timeout);
    }
  }
}
