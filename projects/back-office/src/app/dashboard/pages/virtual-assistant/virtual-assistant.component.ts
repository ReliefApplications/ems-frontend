import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SafeDownloadService} from '../../../../../../safe/src/lib/services/download.service';

@Component({
  selector: 'app-virtual-assistant',
  templateUrl: './virtual-assistant.component.html',
  styleUrls: ['./virtual-assistant.component.scss']
})
export class VirtualAssistantComponent implements OnInit {

  // === DATA ===
  public id = '';

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private downloadService: SafeDownloadService) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log('this.id');
      console.log(this.id);
      this.getForm();
    });
  }

  async getForm(): Promise<void>{
    const path = `download/form/${this.id}`;
    const dataReturn = await this.downloadService.getForm(path);
    console.log('dataReturn');
    console.log(dataReturn);
  }
}
