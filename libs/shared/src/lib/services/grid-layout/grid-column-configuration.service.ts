import { Injectable } from '@angular/core';

/** A user-customized grid column. */
export interface GridColumnConfiguration {
  hidden: boolean;
  width?: number;
  order: number;
}

/** Persisted grid column configuration. */
interface PersistedGridColumnConfiguration {
  savedAt: string;
  layoutModifiedAt?: number;
  columns: Record<string, GridColumnConfiguration>;
}

/** Stored columns are intentionally limited to properties controlled by users. */
export interface GridConfigurableField {
  name: string;
  hidden: boolean;
  width?: number | string;
  order?: number;
  canSee?: boolean;
}

/** Handles browser storage for grid column customizations. */
@Injectable({
  providedIn: 'root',
})
export class GridColumnConfigurationService {
  /** Prefix used to keep grid configuration entries separate from other browser state. */
  private readonly storagePrefix = 'oort:grid-column-configuration:';

  /**
   * Applies a valid, non-stale stored configuration to the available fields.
   * Missing fields are left untouched so new admin-defined columns use defaults.
   *
   * @param key Unique dashboard, widget, and layout storage key.
   * @param fields Fields defined by the current layout.
   * @param layoutModifiedAt Last modification date supplied by the layout.
   * @returns Whether a saved configuration was restored.
   */
  public restore(
    key: string | null,
    fields: GridConfigurableField[],
    layoutModifiedAt?: string | Date
  ): boolean {
    if (!key) return false;

    const storedConfiguration = this.get(key);
    if (!storedConfiguration) return false;

    const modifiedAt = this.parseTimestamp(layoutModifiedAt);
    const savedAt = new Date(storedConfiguration.savedAt).getTime();
    const savedLayoutModifiedAt = storedConfiguration.layoutModifiedAt;
    if (
      !Number.isNaN(modifiedAt) &&
      (savedLayoutModifiedAt !== undefined
        ? modifiedAt > savedLayoutModifiedAt
        : Number.isNaN(savedAt) || modifiedAt > savedAt)
    ) {
      this.remove(key);
      return false;
    }

    fields.forEach((field) => {
      const storedField = storedConfiguration.columns[field.name];
      if (storedField) {
        if (field.canSee !== false) {
          field.hidden = storedField.hidden;
        }
        if (storedField.width !== undefined) {
          field.width = storedField.width;
        }
        field.order = storedField.order;
      }
    });
    return true;
  }

  /**
   * Stores the current column configuration.
   *
   * @param key Unique dashboard, widget, and layout storage key.
   * @param fields Current grid fields.
   * @param layoutModifiedAt Last modification date supplied by the layout.
   */
  public save(
    key: string | null,
    fields: GridConfigurableField[],
    layoutModifiedAt?: string | Date
  ): void {
    if (!key) return;

    const columns = fields.reduce<Record<string, GridColumnConfiguration>>(
      (configuration, field, index) => {
        const width = Number.parseFloat(String(field.width));
        return {
          ...configuration,
          [field.name]: {
            hidden: field.hidden,
            ...(Number.isFinite(width) && { width }),
            order: field.order ?? index,
          },
        };
      },
      {}
    );

    const modifiedAt = this.parseTimestamp(layoutModifiedAt);
    this.set(key, {
      savedAt: new Date().toISOString(),
      ...(!Number.isNaN(modifiedAt) && { layoutModifiedAt: modifiedAt }),
      columns,
    });
  }

  /**
   * Removes the saved configuration for a grid only.
   *
   * @param key Unique dashboard, widget, and layout storage key.
   */
  public remove(key: string | null): void {
    if (!key) return;
    try {
      localStorage.removeItem(this.storageKey(key));
    } catch {
      // Browser storage can be unavailable (for example, private browsing).
    }
  }

  /**
   * Reads a stored configuration without exposing parsing failures to the grid.
   *
   * @param key Unique dashboard, widget, and layout storage key.
   * @returns Valid configuration or null.
   */
  private get(key: string): PersistedGridColumnConfiguration | null {
    try {
      const value = localStorage.getItem(this.storageKey(key));
      if (!value) return null;
      const configuration: unknown = JSON.parse(value);
      return this.isConfiguration(configuration) ? configuration : null;
    } catch {
      return null;
    }
  }

  /**
   * Writes a configuration to browser storage.
   *
   * @param key Unique dashboard, widget, and layout storage key.
   * @param configuration Configuration to persist.
   */
  private set(
    key: string,
    configuration: PersistedGridColumnConfiguration
  ): void {
    try {
      localStorage.setItem(this.storageKey(key), JSON.stringify(configuration));
    } catch {
      // Storage failures must not interrupt grid interactions.
    }
  }

  /**
   * Creates a namespaced browser storage key.
   *
   * @param key Unique dashboard, widget, and layout storage key.
   * @returns Browser storage key.
   */
  private storageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  /**
   * Converts API and browser date representations to milliseconds.
   *
   * @param value Date value to parse.
   * @returns Parsed timestamp or NaN.
   */
  private parseTimestamp(value?: string | Date): number {
    if (!value) return Number.NaN;
    const numericValue = Number(value);
    return Number.isNaN(numericValue)
      ? new Date(value).getTime()
      : numericValue;
  }

  /**
   * Validates data read from browser storage.
   *
   * @param value Parsed browser storage value.
   * @returns Whether the value is a valid grid configuration.
   */
  private isConfiguration(
    value: unknown
  ): value is PersistedGridColumnConfiguration {
    if (!value || typeof value !== 'object') return false;
    const configuration = value as Partial<PersistedGridColumnConfiguration>;
    return (
      typeof configuration.savedAt === 'string' &&
      !!configuration.columns &&
      typeof configuration.columns === 'object' &&
      Object.values(configuration.columns).every(
        (column) =>
          !!column &&
          typeof column.hidden === 'boolean' &&
          (column.width === undefined ||
            (typeof column.width === 'number' &&
              Number.isFinite(column.width))) &&
          typeof column.order === 'number'
      )
    );
  }
}
