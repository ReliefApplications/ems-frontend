import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { EDITOR_LANGUAGE_PAIRS } from '../../const/tinymce.const';
import { TranslateService } from '@ngx-translate/core';
import { Editor, RawEditorSettings } from 'tinymce';
import { DOCUMENT } from '@angular/common';

/**
 * Shared editor service
 * Editor service is used to get main url and current language
 */
@Injectable({
  providedIn: 'root',
})
export class EditorService {
  /** environment variable */
  private environment: any;

  /** Editor scroll listener */
  private editorScrollListener!: any;
  /** Active item scroll listener */
  public activeItemScrollListener!: any;
  /** Allow scrolling timeout listener */
  private allowScrollingTimeoutListener!: NodeJS.Timeout;
  /** Renderer */
  private renderer!: Renderer2;

  /**
   * Compute the base url based on the environment file
   *
   * @returns the base url
   */
  get url(): string {
    if (this.environment.tinymceBaseUrl) {
      return this.environment.tinymceBaseUrl;
    } else {
      return '/tinymce';
    }
  }

  /**
   * Compute the current language
   *
   * @returns the current language
   */
  get language(): string {
    const lang = this.translate.currentLang;
    const editorLang = EDITOR_LANGUAGE_PAIRS.find((x) => x.key === lang);
    let language: string;
    if (editorLang) {
      language = editorLang.tinymceKey;
    } else {
      language = 'en';
    }
    return language;
  }

  /**
   * Configuration component for editor service
   *
   * @param environment Environment file used to get main url of the page
   * @param translate Angular Translate Service
   * @param _renderer RendererFactory2
   * @param document document
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    _renderer: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = _renderer.createRenderer(null, null);
    this.environment = environment;
  }

  /**
   * Add auto completer with {{ }} for data and calc keys
   *
   * @param editor current editor
   * @param keys list of keys
   */
  addCalcAndKeysAutoCompleter(
    editor: RawEditorSettings,
    keys: { value: string; text: string }[]
  ) {
    const defaultSetup = editor.setup;
    editor.setup = (e: Editor) => {
      if (defaultSetup && typeof defaultSetup === 'function') defaultSetup(e);
      e.ui.registry.addAutocompleter('keys_data_and_calc', {
        ch: '{',
        minChars: 0,
        onAction: (autocompleteApi, rng, value) => {
          e.selection.setRng(rng);
          e.insertContent(value);
          autocompleteApi.hide();
          // On successful action clean related listeners
          if (this.editorScrollListener) {
            this.editorScrollListener();
          }
          if (this.activeItemScrollListener) {
            this.activeItemScrollListener();
            this.activeItemScrollListener = null;
          }
        },
        fetch: async (pattern: string) => {
          if (this.activeItemScrollListener) {
            this.activeItemScrollListener();
            this.activeItemScrollListener = null;
          }
          this.allowScrolling();
          return keys.filter((key) =>
            (key.value || key.text).includes(pattern)
          );
        },
      });
    };
  }

  /**
   * Allows scrolling within the TinyMCE autocomplete container, and prevents the autocomplete from closing when clicking on the scrollbar.
   * This function sets a timeout to give TinyMCE some time to render its elements before trying to access them.
   * The editor still closes when a value is successfully selected.
   */
  private allowScrolling() {
    if (this.editorScrollListener) {
      this.editorScrollListener();
    }
    if (this.allowScrollingTimeoutListener) {
      clearTimeout(this.allowScrollingTimeoutListener);
    }
    this.allowScrollingTimeoutListener = setTimeout(() => {
      const autoCompleterContainer =
        this.document.querySelector('.tox-tinymce-aux');
      if (!autoCompleterContainer) return;
      this.editorScrollListener = this.renderer.listen(
        autoCompleterContainer,
        'mousedown',
        function (event: any) {
          event.stopPropagation();
        }
      );
    }, 500);
  }

  /**
   * Sets the active item of autocomplete list into view using the arrow down and up keys
   *
   * @param collectionGroup autocomplete collection list
   * @param editor editor element
   */
  public initScrollActive(collectionGroup: Element, editor: HTMLElement) {
    if (collectionGroup) {
      this.renderer.setAttribute(collectionGroup, 'tabindex', '1');
      (collectionGroup as any).focus();
      this.activeItemScrollListener = this.renderer.listen(
        collectionGroup,
        'keydown',
        (e: any) => {
          this.handleKeyDownEvent(e, collectionGroup, editor);
        }
      );
    }
  }

  /**
   * Sets the active item of autocomplete list into view using the arrow down and up keys
   *
   * @param e KeyBoardEvent
   * @param collectionGroup autocomplete collection list
   * @param editor editor element
   */
  public handleKeyDownEvent(
    e: KeyboardEvent,
    collectionGroup: Element,
    editor: any
  ) {
    if (e.code === 'Tab') {
      if (this.activeItemScrollListener) {
        this.activeItemScrollListener();
        this.activeItemScrollListener = null;
      }
      editor.focus();
    } else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      const currentActiveItem = Array.from(collectionGroup.children).filter(
        (item) => item.className.includes('tox-collection__item--active')
      );
      if (currentActiveItem.length) {
        let showItem =
          e.code === 'ArrowDown'
            ? currentActiveItem[0].nextElementSibling
            : currentActiveItem[0].previousElementSibling;
        // If first or last element on related keydown, then trigger scroll to first or last list element directly
        if (
          e.code === 'ArrowDown' &&
          !currentActiveItem[0].nextElementSibling
        ) {
          showItem = collectionGroup.firstElementChild;
        } else if (
          e.code === 'ArrowUp' &&
          !currentActiveItem[0].previousElementSibling
        ) {
          showItem = collectionGroup.lastElementChild;
        }
        showItem?.scrollIntoView(false);
      }
    }
  }
}
