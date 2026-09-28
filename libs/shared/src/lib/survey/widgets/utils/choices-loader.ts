import { Observable } from 'rxjs';

/** Choice item, as displayed by the select widgets */
export interface ChoiceItem {
  value: any;
  text: string;
}

/** Page of choices, loaded from the server */
export interface ChoicesPage {
  items: ChoiceItem[];
  totalCount: number;
}

/** Options to load a page of choices */
export interface ChoicesLoadOptions {
  /** Text typed by the user in the widget */
  search: string;
  /** Number of choices to skip */
  skip: number;
  /** Number of choices to load */
  take: number;
}

/**
 * Loads the choices of a select question from the server, page by page,
 * instead of storing all of them in the question choices.
 */
export interface ChoicesLoader {
  /**
   * Loads a page of choices matching the search text.
   *
   * @param options Load options
   * @returns Page of choices
   */
  load(options: ChoicesLoadOptions): Observable<ChoicesPage>;
  /**
   * Loads the choices of the given values, so selected values can be
   * displayed even if they are not part of the loaded pages.
   *
   * @param values Selected values
   * @returns Choices of the values that could be found
   */
  loadByValues(values: any[]): Observable<ChoiceItem[]>;
}

/** Name of the question property incremented each time the loader changes */
export const CHOICES_LOADER_VERSION_PROPERTY = 'choicesLoaderVersion';

/**
 * Sets the choices loader of a select question. The select widgets then
 * fetch the choices through the loader instead of using the question choices.
 *
 * @param question Select question ( dropdown / tagbox )
 * @param loader Choices loader, or null to remove it
 */
export const setChoicesLoader = (
  question: any,
  loader: ChoicesLoader | null
): void => {
  question.choicesLoader = loader;
  // Notify the widget through a property change, so it reloads the choices
  question.setPropertyValue(
    CHOICES_LOADER_VERSION_PROPERTY,
    (question.getPropertyValue(CHOICES_LOADER_VERSION_PROPERTY) || 0) + 1
  );
};

/**
 * Gets the choices loader of a select question, if any.
 *
 * @param question Select question ( dropdown / tagbox )
 * @returns Choices loader, or null
 */
export const getChoicesLoader = (question: any): ChoicesLoader | null =>
  question?.choicesLoader ?? null;
