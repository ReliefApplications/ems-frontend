import { Component, OnInit, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_DASHBOARDS_BY_PAGE } from './graphql/queries';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Page } from '@oort-front/shared';

/**
 * Dialog data interface
 */
interface DialogData {
  page: Page;
}

/**
 * List used to manage item specific templates for dashboards
 */
@Component({
  selector: 'app-manage-item-specific-templates-modal',
  templateUrl: './manage-item-specific-templates-modal.component.html',
  styleUrls: ['./manage-item-specific-templates-modal.component.scss'],
})
export class ManageItemSpecificTemplatesModalComponent implements OnInit {
  /**
   * List of all specific templates to display
   */
  public templateList: any[] = [];

  /**
   * List used to manage item specific templates for dashboards
   *
   * @param apollo Apollo
   * @param data Data passed to the modal
   */
  constructor(
    private apollo: Apollo,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_DASHBOARDS_BY_PAGE,
        variables: {
          page: this.data.page.id,
        },
      })
      .valueChanges.pipe()
      .subscribe((res) => {
        console.log('RES', res);
      });
  }
}
