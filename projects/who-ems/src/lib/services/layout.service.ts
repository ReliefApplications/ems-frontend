import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public layoutComponent = new BehaviorSubject<any[]>([]);

  constructor() {}

  get currentComponent(): Observable<any> {
    return this.layoutComponent.asObservable();
  }

  newComponent(comp): void {
    this.layoutComponent.next(comp);
  }



}
