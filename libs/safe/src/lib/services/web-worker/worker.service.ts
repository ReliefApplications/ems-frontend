import { Injectable } from '@angular/core';
import { SafeAppWebWorker } from './web.worker';
import { WorkerManager, WorkerClient } from 'angular-web-worker/angular';

/** Local storage key for last request */
const LAST_REQUEST_KEY = '_last_request';

/** The preview service for apps */
@Injectable({
  providedIn: 'root',
})
export class SafeWorkerService {
  private client!: WorkerClient<SafeAppWebWorker>;

  constructor(private workerManager: WorkerManager) {}

  registerWorker() {
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

  public destroyWorker() {
    this.client?.destroy();
  }

  /**
   *
   * Maps the given choices to a valid choices list for surveyjs
   *
   * @param items
   * @param selectedForeignValue
   * @param operator
   * @param mapProperties
   * @param mapProperties.valueField
   * @param mapProperties.displayField
   * @returns
   */
  public async mapChoices(
    items: any[],
    mapProperties: { valueField: string; displayField: string },
    selectedForeignValue?: any,
    operator?: any
  ): Promise<{ value: string | number; text: string }[]> {
    const mappedChoices: { value: string | number; text: string }[] =
      await this.client.call((w) =>
        w.mapChoices(items, mapProperties, selectedForeignValue, operator)
      );
    return mappedChoices;
  }

  /**
   * Map given widget data
   *
   * @param choices
   * @returns
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
   * @param cacheKey
   * @param items
   * @param valueField
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
   * @param referenceDataID
   * @returns
   */
  public async getStoredData(referenceDataID: string): Promise<any> {
    const storedData = await this.client.call((w) =>
      w.getStoredData(referenceDataID)
    );
    return storedData;
  }

  /**
   * Get cache stored data
   *
   * @param referenceDataID
   * @returns
   */
  public async sortItemsByField(
    items: any,
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
