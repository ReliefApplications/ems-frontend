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
import {
  CALC_FUNCTIONS_META,
  CalcFunctionCategory,
  CalcFunctionMeta,
  INFO_KEYS,
} from '../utils/keys';

/** Display order and labels for calc function categories. */
const CATEGORY_LABELS: Record<CalcFunctionCategory, string> = {
  math: 'Math',
  logic: 'Logic',
  comparison: 'Comparison',
  date: 'Date',
  string: 'String',
  array: 'Array',
  conversion: 'Conversion',
  misc: 'Misc',
};

/** Order in which categories are rendered in the modal. */
const CATEGORY_ORDER: CalcFunctionCategory[] = [
  'math',
  'logic',
  'comparison',
  'date',
  'string',
  'array',
  'conversion',
  'misc',
];

/** Grouped calc functions for the template. */
interface CalcGroup {
  /** Raw category key. */
  category: CalcFunctionCategory;
  /** Human-readable category label. */
  label: string;
  /** Functions belonging to this category, sorted by name. */
  functions: CalcFunctionMeta[];
}

/** Placeholder syntax entry shown alongside the operations. */
interface PlaceholderEntry {
  /** Example placeholder, e.g. `{{data.fieldName}}`. */
  syntax: string;
  /** Short description of the placeholder. */
  description: string;
}

/**
 * Modal that documents the operations and placeholders usable in
 * calculated-field expressions. Mirrors the visual structure of the
 * SurveyJS function reference modal.
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
  selector: 'shared-calculated-field-reference-modal',
  templateUrl: './calculated-field-reference-modal.component.html',
  styleUrls: ['./calculated-field-reference-modal.component.scss'],
})
export class CalculatedFieldReferenceModalComponent implements OnInit {
  /** Search query bound to the input. */
  public query = '';
  /** All calc functions, grouped by category. */
  public allCalcGroups: CalcGroup[] = [];
  /** All placeholder syntaxes documented in the modal. */
  public allPlaceholders: PlaceholderEntry[] = [];

  /**
   * Builds the initial calc and placeholder lists once the component mounts.
   */
  ngOnInit(): void {
    this.allCalcGroups = this.buildCalcGroups();
    this.allPlaceholders = this.buildPlaceholders();
  }

  /**
   * Calc function groups filtered by the current search query.
   *
   * @returns Groups whose functions match the query in name or description.
   *   Empty groups are dropped.
   */
  get calcGroups(): CalcGroup[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.allCalcGroups;
    return this.allCalcGroups
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
   * Placeholders filtered by the current search query.
   *
   * @returns Entries whose syntax or description matches the query.
   */
  get placeholders(): PlaceholderEntry[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.allPlaceholders;
    return this.allPlaceholders.filter(
      (p) =>
        p.syntax.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  /**
   * Buckets the static calc-function metadata by category, then sorts each
   * bucket alphabetically. Categories follow {@link CATEGORY_ORDER}; empty
   * categories are omitted.
   *
   * @returns Ordered groups ready for rendering.
   */
  private buildCalcGroups(): CalcGroup[] {
    const byCategory = new Map<CalcFunctionCategory, CalcFunctionMeta[]>();
    for (const fn of CALC_FUNCTIONS_META) {
      const list = byCategory.get(fn.category) ?? [];
      list.push(fn);
      byCategory.set(fn.category, list);
    }
    return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      functions: (byCategory.get(category) as CalcFunctionMeta[])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }

  /**
   * Builds the placeholder syntax reference. Info placeholders are derived
   * from {@link INFO_KEYS}; the data / user / calc prefixes are documented
   * with a representative example.
   *
   * @returns Placeholder entries in display order.
   */
  private buildPlaceholders(): PlaceholderEntry[] {
    return [
      {
        syntax: '{{data.fieldName}}',
        description:
          'Value of a field on the current resource. Replace `fieldName` with the resource field name.',
      },
      {
        syntax: '{{user.attribute}}',
        description:
          'Value of an attribute on the current user. Replace `attribute` with the configured user attribute.',
      },
      {
        syntax: '{{calc.fn(...)}}',
        description:
          'Result of a calc operation. See the Operations section above for the list of available functions.',
      },
      ...INFO_KEYS.map((key) => ({
        syntax: `{{info.${key}}}`,
        description: `Record info: ${key}.`,
      })),
    ];
  }
}
