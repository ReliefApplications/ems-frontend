import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { get } from 'lodash';
import { Role, User } from '../../../../models/user.model';
import { Application } from '../../../../models/application.model';
import {
  GetApplicationsQueryResponse,
  GetRolesQueryResponse,
  GET_APPLICATIONS,
  GET_ROLES,
} from '../../graphql/queries';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'safe-user-app-roles',
  templateUrl: './user-app-roles.component.html',
  styleUrls: ['./user-app-roles.component.scss'],
})
export class UserAppRolesComponent implements OnInit, AfterViewInit {
  public roles: Role[] = [];
  @Input() user!: User;
  @Input() application?: Application;
  selectedRoles!: FormControl;
  @Output() edit = new EventEmitter();

  @Input() set loading(loading: boolean) {
    if (loading) {
      this.selectedRoles?.disable({ emitEvent: false });
    } else {
      this.selectedRoles?.enable({ emitEvent: false });
    }
  }
  public loadingApplications = false;

  selectedApplication!: FormControl;
  private applicationsQuery!: QueryRef<GetApplicationsQueryResponse>;
  public applications: Application[] = [];
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private readonly PAGE_SIZE = 10;
  private readonly RELOAD_BOTTOM_SCROLL_POSITION = 50;
  @ViewChild('applicationSelect') applicationSelect!: MatSelect;

  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.selectedRoles = this.fb.control(
      get(this.user, 'roles', []).filter((x: Role) => !x.application)
    );
    this.selectedRoles.valueChanges.subscribe((value) => {
      if (this.selectedApplication.value) {
        this.edit.emit({
          roles: value,
          application: this.selectedApplication.value,
        });
      }
    });

    this.selectedApplication = this.fb.control({ value: '', disabled: true });
    this.selectedApplication.valueChanges.subscribe((value) => {
      this.selectedRoles.setValue([], { emitEvent: false });
      this.roles = [];
      if (value) {
        this.getApplicationRoles(value);
      }
    });

    if (!this.application) {
      this.loadingApplications = true;
      this.applicationsQuery =
        this.apollo.watchQuery<GetApplicationsQueryResponse>({
          query: GET_APPLICATIONS,
          variables: {
            first: this.PAGE_SIZE,
            sortField: 'name',
          },
        });
      this.applicationsQuery.valueChanges.subscribe((res) => {
        this.applications = res.data.applications.edges.map((x) => x.node);
        this.pageInfo = res.data.applications.pageInfo;
        this.loading = res.loading;
        this.loadingApplications = res.loading;
        this.selectedApplication.enable();
      });
    } else {
      this.applications = [this.application];
      this.selectedApplication.setValue(this.application.id);
    }
  }

  ngAfterViewInit(): void {
    this.applicationSelect.openedChange.subscribe((opened: boolean) => {
      if (opened) {
        this.registerScrollEvent();
      }
    });
  }

  private getApplicationRoles(application: string): void {
    this.loading = true;
    this.apollo
      .query<GetRolesQueryResponse>({
        query: GET_ROLES,
        variables: {
          application,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.roles = res.data.roles;
        }
        console.log(this.user);
        this.selectedRoles.setValue(
          get(this.user, 'roles', [])
            .filter((x) => x.application === application)
            .map((x) => x.id),
          { emitEvent: false }
        );
        this.loading = res.loading;
      });
  }

  private registerScrollEvent(): void {
    const panel = this.applicationSelect.panel.nativeElement;
    panel.addEventListener('scroll', (event: any) => this.loadOnScroll(event));
  }

  private loadOnScroll(event: any): void {
    if (
      event.target.scrollHeight -
        (event.target.clientHeight + event.target.scrollTop) <
      this.RELOAD_BOTTOM_SCROLL_POSITION
    ) {
      this.onLoadMore();
    }
  }

  private onLoadMore(): void {
    if (!this.loadingApplications && this.pageInfo.hasNextPage) {
      this.loading = true;
      this.loadingApplications = true;
      this.applicationsQuery.fetchMore({
        variables: {
          first: this.PAGE_SIZE,
          afterCursor: this.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            this.loading = false;
            this.loadingApplications = false;
            return prev;
          }
          return Object.assign({}, prev, {
            applications: {
              edges: [
                ...prev.applications.edges,
                ...fetchMoreResult.applications.edges,
              ],
              pageInfo: fetchMoreResult.applications.pageInfo,
            },
          });
        },
      });
    }
  }
}
