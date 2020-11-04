import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public resources: any;
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount'];
  dataSource = [];

  constructor(
    private apollo: Apollo
  ) { }

  /*  Load the resources.
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED
    }).valueChanges.subscribe(res => {
      this.dataSource = res.data.resources;
      this.loading = res.loading;
    });
  }
}
