import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import { TRANSLATE_TEXT_QUERY } from './graphql/queries';

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  /**
   * Service to handle translation queries and field translation setup.
   *
   * @param apollo The apollo client service
   */
  constructor(private apollo: Apollo) {}

  /**
   * Translate text using backend GraphQL query.
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
      const response$ = this.apollo.query<{ translateText: string }>({
        query: TRANSLATE_TEXT_QUERY,
        variables: {
          text,
          from: from || null,
          to,
          format,
        },
        fetchPolicy: 'no-cache',
      });

      const result = await firstValueFrom(response$);
      return result?.data?.translateText || '';
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
   */
  handleFieldTranslation(
    sender: any,
    options: { name: string; value: any },
    translationTimeouts: Map<string, any>,
    latestTranslationSourceValues: Map<string, string>
  ): void {
    const questions = sender.getAllQuestions();

    // Find any question that has translateFrom matching the changed question's name (or valueName)
    const targets = questions.filter((q: any) => {
      const fromName = q.getPropertyValue('translateFrom');
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
