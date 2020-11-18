import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, User, WhoSnackBarService } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddPageMutationResponse, AddRoleMutationResponse, AddRoleToUserMutationResponse, ADD_PAGE, ADD_ROLE, ADD_ROLE_TO_USER, DeletePageMutationResponse, DELETE_PAGE,
  EditApplicationMutationResponse, EditUserMutationResponse, EDIT_APPLICATION, EDIT_USER } from '../graphql/mutations';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  // tslint:disable-next-line: variable-name
  private _application = new BehaviorSubject<Application>(null);

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /*  Get the application from the database, using GraphQL.
  */
  loadApplication(id: string): void {
    this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id
      }
    }).valueChanges.subscribe(res => {
      this._application.next(res.data.application);
    });
  }

  /*  Return the application as an Observable.
  */
  get application(): Observable<Application> {
    return this._application.asObservable();
  }

  deletePage(id: string): void {
    this.apollo.mutate<DeletePageMutationResponse>({
      mutation: DELETE_PAGE,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Page deleted');
      const application = this._application.getValue();
      application.pages = application.pages.filter(x => x.id !== res.data.deletePage.id);
      this._application.next(application);
    });
  }

  reorderPages(pages: string[]): void {
    const application = this._application.getValue();
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: application.id,
        pages
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Pages reordered');
    });
  }

  addPage(value: any): void {
    const application = this._application.getValue();
    if (application) {
      this.apollo.mutate<AddPageMutationResponse>({
        mutation: ADD_PAGE,
        variables: {
          name: value.name,
          type: value.type,
          content: value.content,
          application: application.id
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(`${value.name} page created`);
        const content = res.data.addPage.content;
        application.pages = application.pages.concat([res.data.addPage]);
        this._application.next(application);
        this.router.navigate([`/applications/${application.id}/${value.type}/${content}`]);
      });
    } else {
      this.snackBar.openSnackBar('No opened application.', { error: true });
    }
  }

  addRole(value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddRoleMutationResponse>({
      mutation: ADD_ROLE,
      variables: {
        title: value.title,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${value.title} role created`);
      application.roles = application.roles.concat([res.data.addRole]);
      this._application.next(application);
    });
  }

  inviteUser(value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<AddRoleToUserMutationResponse>({
      mutation: ADD_ROLE_TO_USER,
      variables: {
        id: value.user,
        role: value.role
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${value.title} role created`);
      application.users = application.users.concat([res.data.addRoleToUser]);
      this._application.next(application);
    });
  }

  editUser(user: User, value: any): void {
    const application = this._application.getValue();
    this.apollo.mutate<EditUserMutationResponse>({
      mutation: EDIT_USER,
      variables: {
        id: user.id,
        roles: value.roles,
        application: application.id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(`${user.username} roles updated.`);
      const index = application.users.indexOf(user);
      application.users[index] = res.data.editUser;
      this._application.next(application);
    });
  }
}
