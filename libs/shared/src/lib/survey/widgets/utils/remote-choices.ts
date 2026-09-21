import { isNil } from 'lodash';
import { Observable, Subscription, fromEvent, takeUntil } from 'rxjs';
import { resolveLocalizedString } from '../../../models/localized-string.model';
import {
  CHOICES_LOADER_VERSION_PROPERTY,
  ChoiceItem,
  ChoicesLoader,
  getChoicesLoader,
} from './choices-loader';

/** Number of choices loaded per page */
export const REMOTE_CHOICES_PAGE_SIZE = 50;
/** Distance to the end of the list, in pixels, from which the next page is loaded */
const NEXT_PAGE_SCROLL_THRESHOLD = 90;
/** Key of the loader change callback registered on the question */
const LOADER_CHANGE_CALLBACK_KEY = 'remoteChoices';

/** Surface of the Kendo select widgets ( combobox / multiselect ) used by the remote choices */
export interface RemoteChoicesWidget {
  /** Displayed choices */
  data: any;
  loading: boolean;
  disabled: boolean;
  /** Emits once the popup is opened, whatever opened it */
  opened: Observable<any>;
  /** List rendered in the popup, when open */
  optionsList?: any;
  /** Virtualization settings, with the index of the first rendered choice */
  virtual?: { skip?: number } | null;
}

/** Handle on the remote choices of a select widget */
export interface RemoteChoices {
  /** Searches the choices on the server */
  search: (text: string) => void;
  /** Reloads the first page of choices, with the current search text */
  reload: () => void;
  /** Makes sure the selected value(s) are part of the widget data */
  ensureSelected: () => void;
  /** Adds the question choices ( e.g. newly created records ) to the widget data */
  syncQuestionChoices: () => void;
  /** Releases the callbacks registered on the question */
  dispose: () => void;
}

/**
 * Gets a comparable key of a choice value.
 *
 * @param value Choice value
 * @returns Key of the value
 */
const keyOf = (value: any): string =>
  typeof value === 'object' ? JSON.stringify(value) : String(value);

/**
 * Gets the selected values of a select question, as an array of values.
 *
 * @param question Select question
 * @returns Selected values
 */
const getSelectedValues = (question: any): any[] => {
  const value = question.value;
  if (isNil(value) || value === '') {
    return [];
  }
  return (Array.isArray(value) ? value : [value])
    .map((x: any) => (x && typeof x === 'object' && 'value' in x ? x.value : x))
    .filter((x: any) => !isNil(x) && x !== '');
};

/**
 * Maps the choices stored in a question to choice items.
 *
 * @param question Select question
 * @returns Choice items
 */
const getQuestionChoices = (question: any): ChoiceItem[] => {
  const locale = question.survey?.locale;
  return (question.visibleChoices || question.choices || []).map(
    (choice: any) =>
      typeof choice === 'string'
        ? { value: choice, text: choice }
        : {
            value: choice.value,
            text: resolveLocalizedString(choice.text, locale),
          }
  );
};

/**
 * Wires a select widget to the choices loader of its question: the choices
 * are searched on the server and loaded page by page, instead of being all
 * stored in the question and filtered in the browser.
 *
 * The selected values and the question choices are always part of the widget
 * data, so they can be displayed whatever the loaded page is.
 *
 * @param widget Kendo select widget ( combobox / multiselect )
 * @param question Select question the widget is rendered for
 * @param destroy$ Emits when the widget is destroyed
 * @returns Handle on the remote choices
 */
export const setupRemoteChoices = (
  widget: RemoteChoicesWidget,
  question: any,
  destroy$: Observable<void>
): RemoteChoices => {
  let loader: ChoicesLoader | null = getChoicesLoader(question);
  let search = '';
  /** Choices of the current search, page by page */
  let pageItems: ChoiceItem[] = [];
  /** Selected values and question choices, always displayed */
  let pinnedItems: ChoiceItem[] = [];
  let totalCount = 0;
  let loading = false;
  let requestId = 0;
  const pendingValues = new Set<string>();
  let listSubscription: Subscription | null = null;

  /**
   * Updates the widget data with the pinned items and the loaded pages.
   */
  const publish = () => {
    const pageKeys = new Set(pageItems.map((x) => keyOf(x.value)));
    const data = [
      ...pinnedItems.filter((x) => !pageKeys.has(keyOf(x.value))),
      ...pageItems,
    ];
    widget.data = data;
    widget.loading = loading;
    widget.disabled = question.isReadOnly;
  };

  /**
   * Pins items, so they are always part of the widget data.
   *
   * @param items Items to pin
   * @returns Whether new items were pinned
   */
  const pin = (items: ChoiceItem[]): boolean => {
    const known = new Set(pinnedItems.map((x) => keyOf(x.value)));
    const added = items.filter((x) => !known.has(keyOf(x.value)));
    if (added.length === 0) {
      return false;
    }
    pinnedItems = [...pinnedItems, ...added];
    return true;
  };

  /**
   * Loads a page of choices.
   *
   * @param reset Whether to restart from the first page
   */
  const loadPage = (reset: boolean) => {
    const id = ++requestId;
    if (!loader) {
      pageItems = [];
      totalCount = 0;
      loading = false;
      publish();
      return;
    }
    loading = true;
    widget.loading = true;
    loader
      .load({
        search,
        skip: reset ? 0 : pageItems.length,
        take: REMOTE_CHOICES_PAGE_SIZE,
      })
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: ({ items, totalCount: total }) => {
          // Ignore outdated responses
          if (id !== requestId) {
            return;
          }
          pageItems = reset ? items : [...pageItems, ...items];
          totalCount = total;
          loading = false;
          if (reset) {
            publish();
          } else {
            appendPage();
          }
        },
        error: () => {
          if (id !== requestId) {
            return;
          }
          loading = false;
          publish();
        },
      });
  };

  /**
   * Publishes the data after a page was appended, keeping the scroll
   * position of the list and its rendered choices, as the widget restarts
   * from the top otherwise.
   */
  const appendPage = () => {
    const content: HTMLElement | undefined =
      widget.optionsList?.content?.nativeElement;
    const scrollTop = content?.scrollTop;
    const skip = widget.virtual?.skip;
    publish();
    if (widget.virtual && skip) {
      widget.virtual.skip = skip;
    }
    if (content && scrollTop) {
      setTimeout(() => {
        content.scrollTop = scrollTop;
      });
    }
  };

  /**
   * Fetches the selected values missing from the widget data, and pins them.
   */
  const ensureSelected = () => {
    if (!loader) {
      return;
    }
    const known = new Set(
      [...pinnedItems, ...pageItems].map((x) => keyOf(x.value))
    );
    const missing = getSelectedValues(question).filter(
      (x) => !known.has(keyOf(x)) && !pendingValues.has(keyOf(x))
    );
    if (missing.length === 0) {
      return;
    }
    missing.forEach((x) => pendingValues.add(keyOf(x)));
    loader
      .loadByValues(missing)
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (items) => {
          missing.forEach((x) => pendingValues.delete(keyOf(x)));
          if (pin(items)) {
            publish();
          }
        },
        error: () => {
          missing.forEach((x) => pendingValues.delete(keyOf(x)));
        },
      });
  };

  /**
   * Pins the choices stored in the question ( e.g. records created from the question ).
   */
  const syncQuestionChoices = () => {
    if (pin(getQuestionChoices(question))) {
      publish();
    }
  };

  /**
   * Reloads the choices with the current loader of the question.
   */
  const reload = () => {
    loader = getChoicesLoader(question);
    loadPage(true);
    ensureSelected();
  };

  /**
   * Loads the next page when the end of the list is reached.
   * The scroll of the list is used instead of its page change event, as the
   * widget only pages through the data it already has: it never asks for more
   * than what is loaded.
   */
  const listenToList = () => {
    listSubscription?.unsubscribe();
    listSubscription = null;
    const content: HTMLElement | undefined =
      widget.optionsList?.content?.nativeElement;
    if (!content) {
      return;
    }
    listSubscription = fromEvent(content, 'scroll')
      .pipe(takeUntil(destroy$))
      .subscribe(() => {
        const endReached =
          content.scrollTop + content.clientHeight >=
          content.scrollHeight - NEXT_PAGE_SCROLL_THRESHOLD;
        if (endReached && !loading && pageItems.length < totalCount) {
          loadPage(false);
        }
      });
  };

  /**
   * Searches the choices on the server, instead of filtering the loaded ones.
   *
   * @param text Text typed by the user
   */
  const searchChoices = (text: string) => {
    search = (text || '').trim();
    loadPage(true);
  };

  // The list is created each time the popup opens
  widget.opened.pipe(takeUntil(destroy$)).subscribe(() => listenToList());

  // Reload when the question loader changes ( e.g. filters update )
  const onLoaderChange = () => reload();
  question.registerFunctionOnPropertyValueChanged(
    CHOICES_LOADER_VERSION_PROPERTY,
    onLoaderChange,
    LOADER_CHANGE_CALLBACK_KEY
  );

  reload();
  syncQuestionChoices();

  return {
    search: searchChoices,
    reload,
    ensureSelected,
    syncQuestionChoices,
    dispose: () => {
      listSubscription?.unsubscribe();
      question.unRegisterFunctionOnPropertyValueChanged(
        CHOICES_LOADER_VERSION_PROPERTY,
        LOADER_CHANGE_CALLBACK_KEY
      );
    },
  };
};
