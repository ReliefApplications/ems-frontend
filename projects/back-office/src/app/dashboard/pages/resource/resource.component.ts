import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeSnackBarService, SafeBreadcrumbService } from '@safe/builder';
import {
  EditResourceMutationResponse,
  EDIT_RESOURCE,
} from './graphql/mutations';
import {
  GetResourceByIdQueryResponse,
  GET_RESOURCE_BY_ID,
} from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';

/**
 * Array of tab names sorted by position index.
 */
const ROUTE_TABS: string[] = ['records', 'forms', 'layouts', 'aggregations', 'calculated-fields'];

/**
 * Component used to display resource in a table.
 */
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent implements OnInit {
  public loading = true;
  public id = '';
  public resource: any;
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
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private breadcrumbService: SafeBreadcrumbService
  ) {}

  /** Load data from the id of the resource passed as a parameter. */
  ngOnInit(): void {
    const routeTab: string = this.router.url.split('/').pop() || '';
    this.selectedTab = ROUTE_TABS.findIndex((tab) => tab === routeTab);
    console.log(this.selectedTab);
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
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe(
        (res) => {
          if (res.data.resource) {
            this.resource = res.data.resource;
            this.breadcrumbService.setBreadcrumb(
              '@resource',
              this.resource.name as string
            );
            history.pushState({ resource: this.resource }, '');
            this.loading = res.loading;
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
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/resources']);
        }
      );
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
      .subscribe((res) => {
        if (res.data) {
          this.resource = res.data.editResource;
        }
      });
  }
}
