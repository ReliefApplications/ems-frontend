import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private activityBasePath = '/activity';

  constructor(private restService: RestService) {}

  public track(activity: any) {
    return this.restService.post(this.activityBasePath, activity).subscribe();
  }
}
