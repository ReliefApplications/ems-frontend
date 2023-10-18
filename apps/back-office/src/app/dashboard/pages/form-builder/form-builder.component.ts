import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EDIT_FORM_NAME,
  EDIT_FORM_PERMISSIONS,
  EDIT_FORM_STATUS,
  EDIT_FORM_STRUCTURE,
} from './graphql/mutations';
import { GET_SHORT_FORM_BY_ID } from './graphql/queries';
import { Dialog } from '@angular/cdk/dialog';
import {
  AuthService,
  Form,
  ConfirmService,
  BreadcrumbService,
  status,
  FormQueryResponse,
  EditFormMutationResponse,
} from '@oort-front/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { FormControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { GraphQLError } from 'graphql';

/**
 * Form builder page
 */
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  public loading = true;
  public id = '';
  public form?: Form;
  public structure: any;
  public activeVersions = false;
  public activeVersion: any;

  // === ENUM OF FORM STATUSES ===
  public statusControl = new FormControl<string | undefined>('');
  public statusChoices = Object.values(status);

  // === FORM EDITION ===
  public canEditName = false;
  public formActive = false;
  public hasChanges = false;
  private isStep = false;

  /**
   * Form builder page
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param dialog Dialog service
   * @param authService Shared authentication service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService,
    public dialog: Dialog,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService
  ) {}

  /**
   * Show modal confirmation before leave the page if has changes on form
   *
   * @returns boolean of observable of boolean
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasChanges) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.form.update.exit'),
        content: this.translate.instant('components.form.update.exitMessage'),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      return dialogRef.closed.pipe(
        map((value) => {
          if (value) {
            this.authService.canLogout.next(true);
            window.localStorage.removeItem(`form:${this.id}`);
            return true;
          }
          return false;
        })
      );
    }
    return true;
  }

  ngOnInit(): void {
    this.formActive = false;
    this.statusControl.valueChanges.subscribe((status) => {
      if (status) {
        this.updateStatus(status);
      }
    });
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.apollo
        .watchQuery<FormQueryResponse>({
          query: GET_SHORT_FORM_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            if (data.form) {
              this.loading = loading;
              this.form = data.form;
              this.statusControl.setValue(this.form.status, {
                emitEvent: false,
              });
              this.breadcrumbService.setBreadcrumb(
                '@form',
                this.form.name as string
              );
              this.breadcrumbService.setBreadcrumb(
                '@resource',
                this.form.resource?.name as string
              );
              // this.breadcrumbService.setResourceName();
              this.canEditName = this.form?.canUpdate || false;
              const storedStructure = window.localStorage.getItem(
                `form:${this.id}`
              );
              this.structure = storedStructure
                ? storedStructure
                : this.form.structure;
              if (this.structure !== this.form.structure) {
                this.hasChanges = true;
                this.authService.canLogout.next(!this.hasChanges);
              }
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translate
                      .instant('common.form.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
              // redirect to default screen if error
              this.router.navigate(['/forms']);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            // redirect to default screen if error
            this.router.navigate(['/forms']);
          },
        });
    } else {
      this.loading = false;
      // redirect to default screen if error
      this.router.navigate(['/forms']);
    }
  }

  /**
   * Activate or deactivate form
   */
  toggleFormActive(): void {
    if (this.form?.canUpdate) {
      this.formActive = !this.formActive;
    }
  }

  /**
   * Save form structure
   *
   * @param structure form structure
   */
  public async onSave(structure: any): Promise<void> {
    if (!this.form?.id) {
      alert('not valid');
    } else {
      const { StatusModalComponent } = await import('@oort-front/shared');
      const statusModal = this.dialog.open(StatusModalComponent, {
        disableClose: true,
        data: {
          title: this.translate.instant('components.formBuilder.saveSurvey'),
          showSpinner: true,
        },
      });
      this.apollo
        .mutate<EditFormMutationResponse>({
          mutation: EDIT_FORM_STRUCTURE,
          variables: {
            id: this.form.id,
            structure,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(errors[0].message, {
                error: true,
              });
              statusModal.close();
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.form.one'),
                  value: this.form?.name,
                })
              );
              this.form = { ...data?.editForm, structure };
              this.structure = structure;
              localStorage.removeItem(`form:${this.id}`);
              this.hasChanges = false;
              this.authService.canLogout.next(true);
              statusModal.close();
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            statusModal.close();
          },
        });
    }
  }

  /**
   * Update the status of the form.
   *
   * @param status new status
   */
  private async updateStatus(status: string): Promise<void> {
    const statusModal = await this.getStatusModalRef();
    this.apollo
      .mutate<EditFormMutationResponse>({
        mutation: EDIT_FORM_STATUS,
        variables: {
          id: this.id,
          status,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          this.handleFormMutationResponse(data, errors);
          statusModal.close();
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Handles form mutations response
   *
   * @param {EditFormMutationResponse} data data retrieved from the graphql mutation
   * @param {GraphQLError[]} errors errors from the graphql mutation if any
   * @param {string} formName new form name if any
   */
  private handleFormMutationResponse(
    data: EditFormMutationResponse | null | undefined,
    errors: readonly GraphQLError[] | undefined,
    formName?: string
  ) {
    if (errors) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotUpdated', {
          type: this.translate.instant(
            formName ? 'common.form.one' : 'common.status'
          ),
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
    } else {
      const successMessage = formName
        ? this.translate.instant('common.notifications.objectUpdated', {
            type: this.translate.instant('common.form.one').toLowerCase(),
            value: formName,
          })
        : this.translate.instant('common.notifications.statusUpdated', {
            value: data?.editForm.status,
          });
      this.snackBar.openSnackBar(successMessage);
      if (formName) {
        this.form = { ...this.form, name: data?.editForm.name };
        this.breadcrumbService.setBreadcrumb('@form', this.form.name as string);
      } else {
        this.form = { ...this.form, status: data?.editForm.status };
        this.statusControl.setValue(data?.editForm.status, {
          emitEvent: false,
        });
      }
    }
  }

  /**
   * Open a modal and returns it's reference
   */
  private async getStatusModalRef() {
    const { StatusModalComponent } = await import('@oort-front/shared');
    return this.dialog.open(StatusModalComponent, {
      disableClose: true,
      data: {
        title: 'Saving survey',
        showSpinner: true,
      },
    });
  }

  /**
   * Available in previous version to change the template.
   *
   * @param id id of version
   */
  setTemplate(id: string): void {
    this.apollo
      .watchQuery<FormQueryResponse>({
        query: GET_SHORT_FORM_BY_ID,
        variables: {
          id,
        },
      })
      .valueChanges.subscribe(({ data }) => {
        this.structure = data.form.structure;
      });
  }

  /**
   * Available in previous version to change the version.
   *
   * @param e new version
   */
  public onOpenVersion(e: any): void {
    this.activeVersion = e;
    this.structure = this.activeVersion.data;
    // this.surveyCreator.makeNewViewActive('test');
    // this.surveyCreator.saveSurveyFunc = null;
  }

  /**
   * Available in previous version to change the version.
   */
  public resetActiveVersion(): void {
    this.activeVersion = null;
    this.structure = this.form?.structure;
    // this.surveyCreator.makeNewViewActive('designer');
    // this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
  }

  /**
   * Edit the form name.
   *
   * @param {string} formName new form name
   */
  public async saveName(formName: string): Promise<void> {
    if (formName && formName !== this.form?.name) {
      const statusModal = await this.getStatusModalRef();
      this.apollo
        .mutate<EditFormMutationResponse>({
          mutation: EDIT_FORM_NAME,
          variables: {
            id: this.id,
            name: formName,
          },
        })
        .subscribe(({ errors, data }) => {
          this.handleFormMutationResponse(data, errors, formName);
          statusModal.close();
        });
    }
  }

  /**
   * Edit the permissions layer.
   *
   * @param e new permissions
   */
  async saveAccess(e: any): Promise<void> {
    const { StatusModalComponent } = await import('@oort-front/shared');
    const statusModal = this.dialog.open(StatusModalComponent, {
      disableClose: true,
      data: {
        title: 'Saving survey',
        showSpinner: true,
      },
    });
    this.apollo
      .mutate<EditFormMutationResponse>({
        mutation: EDIT_FORM_PERMISSIONS,
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
                type: this.translate.instant('common.access'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
            statusModal.close();
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.access'),
                value: '',
              })
            );
            this.form = { ...data?.editForm, structure: this.structure };
            statusModal.close();
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Called when form structure is updated
   *
   * @param event update event
   */
  formStructureChange(event: any): void {
    this.hasChanges = !isEqual(
      JSON.parse(event),
      JSON.parse(this.form?.structure || '{}')
    );
    localStorage.setItem(`form:${this.id}`, event);
    this.authService.canLogout.next(!this.hasChanges);
  }
}
