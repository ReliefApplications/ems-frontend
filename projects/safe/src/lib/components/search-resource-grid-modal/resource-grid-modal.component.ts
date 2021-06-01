import { Component, Inject, OnInit } from '@angular/core';
import { GET_RESOURCE_BY_ID, GetResourceByIdQueryResponse } from '../../graphql/queries';
import { Apollo } from 'apollo-angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QueryBuilderService } from '../../services/query-builder.service';

@Component({
  selector: 'safe-resource-table-modal',
  templateUrl: './resource-grid-modal.component.html',
  styleUrls: ['./resource-grid-modal.component.css']
})
export class SafeResourceGridModalComponent implements OnInit {

  public resourceName = '';
  public multiSelect = false;
  public records: any[] = [];
  public gridFields: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      id: string,
      name: string,
      multiselect: boolean
    },
    public apollo: Apollo, private queryBuilder: QueryBuilderService
  ) {
    console.log('NAME', name);
    this.multiSelect = data.multiselect;
    // this.getResourceById(data.id);
  }

  ngOnInit(): void {
  }

}
