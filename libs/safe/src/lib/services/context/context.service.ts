import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SafeApplicationService } from '../application/application.service';
import { Application } from '../../models/application.model';
import localForage from 'localforage';

/**
 * Application context service
 * Used to get filter value
 */
@Injectable({
  providedIn: 'root',
})
export class ContextService {
  public filter = new BehaviorSubject<any>(null);
  public filterStructure = new BehaviorSubject<any>(null);
  public filterPosition = new BehaviorSubject<any>(null);
  private currentApplicationId?: string | null = null;

  /** @returns filter value as observable */
  get filter$() {
    return this.filter.asObservable();
  }

  /** @returns filterStructure value as observable */
  get filterStructure$() {
    return this.filterStructure.asObservable();
  }

  /** @returns filterPosition value as observable */
  get filterPosition$() {
    return this.filterPosition.asObservable();
  }

  get positionKey(): string {
    return this.currentApplicationId + ':filterPosition';
  }

  constructor(private applicationService: SafeApplicationService) {
    this.applicationService.application$.subscribe(
      (application: Application | null) => {
        if (application) {
          if (this.currentApplicationId !== application.id) {
            this.currentApplicationId = application.id;
            this.filter.next(null);
            console.log(application.contextualFilter);
            this.filterStructure.next(application.contextualFilter);
            localForage.getItem(this.positionKey).then((position) => {
              console.log(position);
              if (position) {
                this.filterPosition.next(position);
              } else {
                console.log('ici');
                this.filterPosition.next(application.contextualFilterPosition);
              }
            });
          }
        } else {
          this.currentApplicationId = null;
          this.filter.next(null);
          this.filterStructure.next(null);
          this.filterPosition.next(null);
        }
      }
    );
    this.filterPosition$.subscribe((position: any) => {
      console.log('la');
      if (position && this.currentApplicationId) {
        console.log('ici');
        localForage.setItem(this.positionKey, position);
      }
    });
  }
}
