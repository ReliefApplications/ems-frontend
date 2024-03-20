import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditResourceMutationResponse,
  ResourceQueryResponse,
  BreadcrumbService,
} from '@oort-front/shared';
import { EDIT_RESOURCE } from './graphql/mutations';
import { GET_RESOURCE_BY_ID } from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';

/**
 * Array of tab names sorted by position index.
 */
const ROUTE_TABS: string[] = [
  'forms',
  'layouts',
  'aggregations',
  'calculated-fields',
  'records',
];

/**
 * Component used to display resource in a table.
 */
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent implements OnInit {
  // === DATA ===
  /**
   * Loading state
   */
  public loading = true;
  /**
   * Resource id
   */
  public id = '';
  /**
   * Resource
   */
  public resource: any;
  /**
   * Selected tab
   */
  public selectedTab = 0;

  /**
   * ResourceComponent constructor.
   *
   * @param apollo Used to load the resources.
   * @param route Used to get route arguments.
   * @param router Used to change app route.
   * @param snackBar Service used to show a snackbar.
   * @param translate Service used to get translations.
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService
  ) {}

  /** Load data from the id of the resource passed as a parameter. */
  ngOnInit(): void {
    const routeTab: string = this.router.url.split('/').pop() || '';
    this.selectedTab = ROUTE_TABS.findIndex((tab) => tab === routeTab);
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getResourceData();
    } else {
      this.router.navigate(['/resources']);
    }
  }

  /**
   * Loads resource data.
   */
  private getResourceData(): void {
    this.loading = true;

    // get the resource and the form linked
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data.resource) {
            this.resource = data.resource;
            this.breadcrumbService.setBreadcrumb(
              '@resource',
              this.resource.name as string
            );
            history.pushState({ resource: this.resource }, '');
            this.loading = loading;
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.accessNotProvided', {
                type: this.translate
                  .instant('common.resource.one')
                  .toLowerCase(),
                error: '',
              }),
              { error: true }
            );
            this.router.navigate(['/resources']);
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/resources']);
        },
      });
  }

  /**
   * Edits the permissions layer.
   *
   * @param e New permissions.
   */
  saveAccess(e: any): void {
    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE,
        variables: {
          id: this.id,
          permissions: e,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.resource.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.resource.one'),
                value: '',
              })
            );
            if (data) {
              this.resource = data.editResource;
            }
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }
}
