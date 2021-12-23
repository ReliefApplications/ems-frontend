import { Apollo } from 'apollo-angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, Page, Step, SafeFormComponent } from '@safe/builder';
import { GetFormByIdQueryResponse, GetPageByIdQueryResponse, GetStepByIdQueryResponse,
  GET_FORM_BY_ID, GET_PAGE_BY_ID, GET_STEP_BY_ID } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;

  // === DATA ===
  public loading = true;
  public id = '';
  public form: Form = {};
  public completed = false;
  public hideNewRecord = false;
  public canCreateRecords = false;

  // === ROUTER ===
  public page?: Page;
  public step?: Step;

  // === ROUTE ===
  public isStep = false;
  private routeSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      if (this.isStep) {
        this.apollo.watchQuery<GetStepByIdQueryResponse>({
          query: GET_STEP_BY_ID,
          variables: {
            id: this.id
          }
        }).valueChanges.subscribe((res) => {
          this.step = res.data.step;
          this.apollo.watchQuery<GetFormByIdQueryResponse>({
            query: GET_FORM_BY_ID,
            variables: {
              id: this.step.content
            }
          }).valueChanges.subscribe((res2) => {
            if (res2.data) {
              this.form = res2.data.form;
            }
            if (!this.form || this.form.status !== 'active' || !this.form.canCreateRecords) {
              this.snackBar.openSnackBar(NOTIFICATIONS.objectAccessDenied('form'), { error: true });
            } else {
              this.canCreateRecords = true;
            }
            this.loading = res2.data.loading;
          });
        });
      } else {
        this.apollo.watchQuery<GetPageByIdQueryResponse>({
          query: GET_PAGE_BY_ID,
          variables: {
            id: this.id
          }
        }).valueChanges.subscribe((res) => {
          this.page = res.data.page;
          this.apollo.watchQuery<GetFormByIdQueryResponse>({
            query: GET_FORM_BY_ID,
            variables: {
              id: this.page.content
            }
          }).valueChanges.subscribe((res2) => {
            if (res2.data) {
              this.form = res2.data.form;
            }
            if (!this.form || this.form.status !== 'active' || !this.form.canCreateRecords) {
              this.snackBar.openSnackBar(NOTIFICATIONS.objectAccessDenied('form'), { error: true });
            } else {
              this.canCreateRecords = true;
            }
            this.loading = res2.data.loading;
          });
        });
      }
    });
  }

  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;
  }

  clearForm(): void {
    this.formComponent?.reset();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
