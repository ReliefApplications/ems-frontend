import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
} from '@oort-front/ui';
import { FunctionFactory } from 'survey-core';
import {
  CUSTOM_FUNCTIONS_META,
  CustomFunctionCategory,
  CustomFunctionMeta,
} from '../../../utils/custom-functions';

/** Display order and labels for custom function categories. */
const CATEGORY_LABELS: Record<CustomFunctionCategory, string> = {
  record: 'Record',
  date: 'Date',
  matrix: 'Matrix',
  array: 'Array',
  string: 'String',
  misc: 'Misc',
};

/** Order in which categories are rendered in the modal. */
const CATEGORY_ORDER: CustomFunctionCategory[] = [
  'record',
  'date',
  'matrix',
  'array',
  'string',
  'misc',
];

/** Grouped custom functions for the template. */
interface CustomGroup {
  /** Raw category key. */
  category: CustomFunctionCategory;
  /** Human-readable category label. */
  label: string;
  /** Functions belonging to this category, sorted by name. */
  functions: CustomFunctionMeta[];
}

/**
 * Modal that lists all functions usable in SurveyJS expressions.
 * Custom functions are shown with full metadata; SurveyJS built-ins are
 * listed by name and link out to the official docs.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    IconModule,
    FormWrapperModule,
  ],
  selector: 'shared-function-reference-modal',
  templateUrl: './function-reference-modal.component.html',
  styleUrls: ['./function-reference-modal.component.scss'],
})
export class FunctionReferenceModalComponent implements OnInit {
  /** Search query bound to the input. */
  public query = '';
  /** All custom functions, grouped by category. */
  public allCustomGroups: CustomGroup[] = [];
  /** All built-in function names, sorted alphabetically. */
  public allBuiltins: string[] = [];
  /** External link to SurveyJS built-in function docs. */
  public readonly builtinDocsUrl =
    'https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#built-in-functions';

  /**
   * Builds the initial custom and built-in lists once the component mounts.
   */
  ngOnInit(): void {
    this.allCustomGroups = this.buildCustomGroups();
    this.allBuiltins = this.buildBuiltins();
  }

  /**
   * Custom function groups filtered by the current search query.
   *
   * @returns Groups whose functions match the query in name or description.
   *   Empty groups are dropped.
   */
  get customGroups(): CustomGroup[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.allCustomGroups;
    return this.allCustomGroups
      .map((group) => ({
        ...group,
        functions: group.functions.filter(
          (fn) =>
            fn.name.toLowerCase().includes(q) ||
            fn.description.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.functions.length > 0);
  }

  /**
   * Built-in SurveyJS function names filtered by the current search query.
   *
   * @returns Names containing the query (case-insensitive).
   */
  get builtins(): string[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.allBuiltins;
    return this.allBuiltins.filter((name) => name.toLowerCase().includes(q));
  }

  /**
   * Buckets the static custom-function metadata by category, then sorts each
   * bucket alphabetically. Categories follow {@link CATEGORY_ORDER}; empty
   * categories are omitted.
   *
   * @returns Ordered groups ready for rendering.
   */
  private buildCustomGroups(): CustomGroup[] {
    const byCategory = new Map<CustomFunctionCategory, CustomFunctionMeta[]>();
    for (const fn of CUSTOM_FUNCTIONS_META) {
      const list = byCategory.get(fn.category) ?? [];
      list.push(fn);
      byCategory.set(fn.category, list);
    }
    return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      functions: (byCategory.get(category) as CustomFunctionMeta[])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }

  /**
   * Reads every name from SurveyJS's {@link FunctionFactory} registry and
   * subtracts the names we register ourselves so only true built-ins remain.
   *
   * @returns Built-in function names sorted alphabetically.
   */
  private buildBuiltins(): string[] {
    const customNames = new Set(CUSTOM_FUNCTIONS_META.map((f) => f.name));
    return FunctionFactory.Instance.getAll()
      .filter((name) => !customNames.has(name))
      .sort((a, b) => a.localeCompare(b));
  }
}
