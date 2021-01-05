import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DeleteResourceMutationResponse, DELETE_RESOURCE } from '../../../graphql/mutations';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';
import { Resource, WhoConfirmModalComponent } from '@who-ems/builder';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public resources: any;
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];
  dataSource = [];

  constructor(
    private dialog: MatDialog,
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

  onDelete(resource: Resource): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete Resource',
        content: `Are you sure you want to delete this resource?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<DeleteResourceMutationResponse>({
          mutation: DELETE_RESOURCE,
          variables: {
            id: resource.id
          }
        }).subscribe(res => {
          this.dataSource = this.dataSource.filter(x => x.id !== resource.id);
        });
      }
    });
  }
}
