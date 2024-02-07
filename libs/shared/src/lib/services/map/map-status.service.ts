import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for managing the status of the map and dashboard export.
 */
@Injectable({
  providedIn: 'root',
})
export class MapStatusService {
  /** BehaviorSubject that holds the current status of the map. */
  private mapStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  /** Observable that observes true if at least 1 map exists in a dashboard */
  mapStatus$: Observable<boolean> = this.mapStatusSubject.asObservable();
  /** BehaviorSubject that holds the current status of the pdf Export.*/
  private isExportingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  /** Observable that observes true if the pdf or image export is in progress. */
  isExporting$: Observable<boolean> = this.isExportingSubject.asObservable();
  /**
   * BehaviourSubject that is set to true true if all the maps on the dashboard
   * are loaded and ready for exporting.
   */
  private mapReadyForExportSubject = new BehaviorSubject<boolean>(false);
  /**
   * Observable that observes true if all the maps on the dashboard
   * are loaded and ready for exporting.
   */
  mapReadyForExport$ = this.mapReadyForExportSubject.asObservable();
  /** BehaviorSubject that holds the count of map widgets present on the dashboard. */
  private mapCountSubject = new BehaviorSubject<number>(0);
  /** Observable that observes the count of map widgets present on the dashboard.*/
  mapCount$ = this.mapCountSubject.asObservable();
  /** BehaviorSubject that holds the count of loaded maps during current dashboard export. */
  private mapLoadedCount = new BehaviorSubject<number>(0);
  /** Observable that observes the count of loaded maps during current dashboard export. */
  mapLoaded$ = this.mapLoadedCount.asObservable();

  /**
   * Increments the count of map widgets present on the dashboard.
   */
  incrementMapCount(): void {
    this.mapStatusSubject.next(true);
    this.mapCountSubject.next(this.mapCountSubject.value + 1);
  }

  /**
   * Decrements the count of map widgets present on the dashboard.
   */
  decrementMapCount(): void {
    this.mapCountSubject.next(Math.max(0, this.mapCountSubject.value - 1));
  }

  /**
   * Resets the count of map widgets present on the dashboard to 0.
   */
  resetMapCount(): void {
    this.mapCountSubject.next(0);
    this.clearLoadedMaps();
  }

  /**
   * Increments the count of loaded maps during current dashboard export.
   */
  incrementMapLoadedCount(): void {
    this.mapLoadedCount.next(this.mapLoadedCount.value + 1);
    this.allMapsLoaded();
  }

  /**
   * Decrements the count of loaded maps during current dashboard export.
   */
  decrementMapLoadedCount(): void {
    this.mapLoadedCount.next(this.mapLoadedCount.value - 1);
    this.allMapsLoaded();
  }

  /**
   * Checks if all the maps on the dashboard are loaded and ready for exporting.
   *
   * @returns true if all the maps on the dashboard are loaded and ready for exporting.
   */
  allMapsLoaded(): boolean {
    const ready = this.mapCountSubject.value === this.mapLoadedCount.value;
    if (ready) {
      this.mapReadyForExportSubject.next(ready);
    }
    return ready;
  }

  /**
   * Resets the count of loaded maps during current dashboard export to 0.
   */
  clearLoadedMaps(): void {
    this.mapLoadedCount.next(0);
  }

  /**
   * Updates the current export status of the kendo export on dashboard.
   *
   * @param status The new status of the map.
   */
  updateExportingStatus(status: boolean): void {
    this.isExportingSubject.next(status);
  }
}
