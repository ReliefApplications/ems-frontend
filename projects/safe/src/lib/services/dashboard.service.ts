import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafeDashboardService {

  private dashboard = new BehaviorSubject<Dashboard | null>(null);

  get dashboard$(): Observable<Dashboard | null> {
    return this.dashboard.asObservable();
  }

  constructor() { }

  openDashboard(dashboard: Dashboard): void {
    this.dashboard.next(dashboard);
  }

  closeDashboard(): void {
    this.dashboard.next(null);
  }
}
