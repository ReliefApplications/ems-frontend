import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Dashboard export service.
 * Handles the count of maps ready for export.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardExportService {
  /** BehaviorSubject that holds the current status of the pdf or image export.*/
  public isExportingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  /** Observable that observes true if the pdf or image export is in progress. */
  public isExporting$: Observable<boolean> =
    this.isExportingSubject.asObservable();
  /** BehaviorSubject that holds the count of loaded maps during current dashboard export. */
  public mapLoadedCount = new BehaviorSubject<number>(0);
  /** Observable that observes number of loaded maps */
  public mapLoadedCount$: Observable<number> =
    this.mapLoadedCount.asObservable();

  /**
   * Increments the count of loaded maps during current dashboard export.
   */
  public incrementMapLoadedCount(): void {
    this.mapLoadedCount.next(this.mapLoadedCount.value + 1);
  }
}
