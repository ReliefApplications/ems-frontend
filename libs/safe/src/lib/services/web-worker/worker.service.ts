import { Injectable } from '@angular/core';
import { SafeAppWebWorker, CachedItems } from './web.worker';
import { WorkerManager, WorkerClient } from 'angular-web-worker/angular';

/** Local storage key for last request */
const LAST_REQUEST_KEY = '_last_request';

/** The preview service for apps */
@Injectable({
  providedIn: 'root',
})
export class SafeWorkerService {
  private client!: WorkerClient<SafeAppWebWorker>;

  /**
   * Constructor
   *
   * @param workerManager The worker manager
   */
  constructor(private workerManager: WorkerManager) {}

  /**
   * Register the worker
   */
  registerWorker(): void {
    if (this.workerManager.isBrowserCompatible) {
      this.client = this.workerManager.createClient(SafeAppWebWorker);
    } else {
      // if code won't block UI else implement other fallback behaviour
      this.client = this.workerManager.createClient(SafeAppWebWorker, true);
    }

    this.client.connect().then(() => {
      console.log('Web worker connected');
    });
  }

  /**
   * Destroy the worker
   */
  public destroyWorker(): void {
    this.client?.destroy();
  }

  /**
   *
   * Maps the given choices to a valid choices list for surveyjs
   *
   * @param items The items to map
   * @param mapProperties The properties to map
   * @param mapProperties.valueField The value field
   * @param mapProperties.displayField The display field
   * @param selectedForeignValue The selected foreign value
   * @param operator The operator to use for the operation
   * @returns The mapped items
   */
  public async mapChoices(
    items: any[],
    mapProperties: { valueField: string; displayField: string },
    selectedForeignValue?: any,
    operator?: any
  ): Promise<{ value: string | number; text: string }[]> {
    const mappedChoices = await this.client.call((w) =>
      w.mapChoices(items, mapProperties, selectedForeignValue, operator)
    );
    return mappedChoices;
  }

  /**
   * Map given widget data
   *
   * @param choices The choices to map
   * @param valueField The value field
   * @param textField The text field
   * @returns The mapped widget data
   */
  public async mapWidgetData(
    choices: any[],
    valueField: string,
    textField: string
  ): Promise<any[]> {
    const mappedWidgetData = await this.client.call((w) =>
      w.mapWidgetData(choices, valueField, textField)
    );
    return mappedWidgetData;
  }

  /**
   * Updates cache with the given items and cache key
   *
   * @param cacheKey The cache key
   * @param items The items to update
   * @param valueField The value field
   */
  public updateCacheStore(cacheKey: string, items: any[], valueField: string) {
    this.client
      .call((w) => w.updateCacheStore(cacheKey, items, valueField))
      .then(() => {
        localStorage.setItem(
          cacheKey + LAST_REQUEST_KEY,
          this.formatDateSQL(new Date())
        );
      });
  }

  /**
   * Get cache stored data
   *
   * @param referenceDataID The reference data ID
   * @returns The stored data
   */
  public async getStoredData(referenceDataID: string): Promise<CachedItems> {
    const storedData = await this.client.call((w) =>
      w.getStoredData(referenceDataID)
    );
    return storedData;
  }

  /**
   * Sort items by field
   *
   * @param items The items to sort
   * @param displayField The display field
   * @returns The sorted items
   */
  public async sortItemsByField(
    items: any[],
    displayField: string
  ): Promise<any[]> {
    const sortedItems = await this.client.call((w) =>
      w.sortItemsByField(items, displayField)
    );
    return sortedItems;
  }

  /**
   * Format a date to YYYY-MM-DD HH:MM:SS.
   *
   * @param date date to format.
   * @returns String formatted to YYYY-MM-DD HH:MM:SS.
   */
  private formatDateSQL(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000) // remove timezone
      .toISOString() // convert to iso string
      .replace('T', ' ') // remove the T between date and time
      .split('.')[0]; // remove the decimals after the seconds
  }
}
