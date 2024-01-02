import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for managing the status of the map and dashboard export.
 */
@Injectable({
  providedIn: 'root',
})
export class MapStatusService {
  /**
   * BehaviorSubject that holds the current status of the map.
   */
  private mapStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  mapStatus$: Observable<boolean> = this.mapStatusSubject.asObservable();

  /**
   * BehaviorSubject that holds the current status of the pdf Export.
   */
  private isExportingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isExporting$: Observable<boolean> = this.isExportingSubject.asObservable();

  /**
   * Updates the status of the map.
   *
   * @param {boolean} status - The new status of the map.
   */
  updateMapStatus(status: boolean): void {
    this.mapStatusSubject.next(status);
  }

  /**
   * Updates the status of the kendo export.
   *
   * @param {boolean} status - The new status of the map.
   */
  updateExportingStatus(status: boolean): void {
    this.isExportingSubject.next(status);
  }
}
