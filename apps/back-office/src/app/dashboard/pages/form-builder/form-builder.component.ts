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
  SnackbarSpinnerComponent,
} from '@oort-front/shared';

import { SpinnerComponent } from '@oort-front/ui';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { FormControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { GraphQLError } from 'graphql';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { QueryBuilderService } from '@oort-front/shared';

/** Default snackbar config for after request complete  */
const REQUEST_SNACKBAR_CONF = {
  error: false,
  duration: 2000,
  data: { loading: false },
};

/**
 * Form builder page
 */
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  /** Loading state */
  public loading = true;
  /** Form id */
  public id = '';
  /** Form */
  public form?: Form;
  /** Form structure */
  public structure: any;
  /** Form versions */
  public activeVersions = false;
  /** Form active version */
  public activeVersion: any;

  // === ENUM OF FORM STATUSES ===
  /** Status control */
  public statusControl = new FormControl<string | undefined>('');
  /** Status choices */
  public statusChoices = Object.values(status);

  // === FORM EDITION ===
  /** Can edit name */
  public canEditName = false;
  /** Form active */
  public formActive = false;
  /** Has changes */
  public hasChanges = false;
  /** Is step */
  private isStep = false;
  /** Prevent form builder to display multiple modals when exiting. */
  private deactivating = false;

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
   * @param overlay Angular overlay service
   * @param queryBuilder Query builder service
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
    private breadcrumbService: BreadcrumbService,
    private overlay: Overlay,
    private queryBuilder: QueryBuilderService
  ) {}

  /**
   * Show modal confirmation before leave the page if has changes on form
   *
   * @returns boolean of observable of boolean
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasChanges && !this.deactivating) {
      this.deactivating = true;
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.form.update.exit'),
        content: this.translate.instant('components.form.update.exitMessage'),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      return dialogRef.closed.pipe(
        map((value) => {
          this.deactivating = false;
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
   * Set up needed headers and response information for the file download action
   *
   * @param {string} translationKey Translation key for the file download snackbar message
   * @param {number} duration Time duration of the opened snackbar element
   * @returns snackbar reference and header for the file download request
   */
  private snackBarMessageInit(
    translationKey: string = 'common.loading',
    duration: number = 0
  ) {
    // Opens a loader in a snackbar
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SnackbarSpinnerComponent,
      {
        duration,
        data: {
          message: this.translate.instant(translationKey),
          loading: true,
        },
      }
    );
    return snackBarRef;
  }

  /**
   * Create a loading overlay that covers the whole viewport using cdk overlay
   *
   * @returns {OverlayRef} Overlay reference
   */
  private createLoadingOverlay(): OverlayRef {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
    });
    overlayRef.attach(new ComponentPortal(SpinnerComponent));
    return overlayRef;
  }

  /**
   * Save form structure
   *
   * @param structure form structure
   */
  public async onSave(structure: any): Promise<void> {
    const loadingSnackbarRef = this.snackBarMessageInit();
    const overlayRef = this.createLoadingOverlay();
    if (!this.form?.id) {
      alert('not valid');
    } else {
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
            // Dismiss the loading snackbar
            loadingSnackbarRef.instance.dismiss();
            // Open new snackbar with the request error or success message
            const message = errors
              ? errors[0].message
              : this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.form.one').toLowerCase(),
                  value: '',
                });
            const snackbarConfig = {
              ...REQUEST_SNACKBAR_CONF,
              error: errors ? true : false,
            };
            this.snackBar.openSnackBar(message, snackbarConfig);

            if (!errors) {
              this.form = { ...data?.editForm, structure };
              this.structure = structure;
              localStorage.removeItem(`form:${this.id}`);
              this.hasChanges = false;
              this.authService.canLogout.next(true);
            }
          },
          error: (err) => {
            // Dismiss the loading snackbar
            loadingSnackbarRef.instance.dismiss();
            this.snackBar.openSnackBar(err.message, { error: true });
          },
          complete: async () => {
            // Detach the current set overlay
            overlayRef.detach();

            let connected = false;

            // Subscribe to the isDoneLoading$ observable to get the current state of 
            // the backend connection after reloading the query types
            await this.queryBuilder.isDoneLoading$.subscribe(
              async (isDoneLoading) => {
                connected = isDoneLoading;
              }
            );

            // Wait for 3 seconds to start reloading the query types
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Reload the query types
            this.queryBuilder.reloadQueryTypes.next(null);

            // Set the isDoneLoading to false to wait for the backend connection
            this.queryBuilder.isDoneLoading.next(false);

            // Wait for backend connection to be established
            const waitForBackendConnection = async (): Promise<void> => {
              while (!connected) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            };

            // Start waiting for backend connection
            await waitForBackendConnection();
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
    const loadingSnackbarRef = this.snackBarMessageInit();
    const overlayRef = this.createLoadingOverlay();

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
          // Dismiss the loading snackbar
          loadingSnackbarRef.instance.dismiss();
          this.handleFormMutationResponse(data, errors);
        },
        error: (err) => {
          // Dismiss the loading snackbar
          loadingSnackbarRef.instance.dismiss();
          this.snackBar.openSnackBar(err.message, { error: true });
        },
        complete: () => {
          // Detach the current set overlay
          overlayRef.detach();
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
    const loadingSnackbarRef = this.snackBarMessageInit();
    const overlayRef = this.createLoadingOverlay();

    if (formName && formName !== this.form?.name) {
      this.apollo
        .mutate<EditFormMutationResponse>({
          mutation: EDIT_FORM_NAME,
          variables: {
            id: this.id,
            name: formName,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            // Dismiss the loading snackbar
            loadingSnackbarRef.instance.dismiss();
            this.handleFormMutationResponse(data, errors, formName);
          },
          error: () => {
            // Dismiss the loading snackbar
            loadingSnackbarRef.instance.dismiss();
          },
          complete: () => {
            // Detach the current set overlay
            overlayRef.detach();
          },
        });
    }
  }

  /**
   * Edit the permissions layer.
   *
   * @param e new permissions
   */
  async saveAccess(e: any): Promise<void> {
    const loadingSnackbarRef = this.snackBarMessageInit();
    const overlayRef = this.createLoadingOverlay();

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
          // Dismiss the loading snackbar
          loadingSnackbarRef.instance.dismiss();
          // Open new snackbar with the request error or success message
          const message = errors
            ? this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.access'),
                error: errors ? errors[0].message : '',
              })
            : this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.access'),
                value: '',
              });
          const snackbarConfig = {
            ...REQUEST_SNACKBAR_CONF,
            error: errors ? true : false,
          };
          this.snackBar.openSnackBar(message, snackbarConfig);
          if (!errors) {
            this.form = { ...data?.editForm, structure: this.structure };
          }
        },
        error: (err) => {
          loadingSnackbarRef.instance.dismiss();
          this.snackBar.openSnackBar(err.message, { error: true });
        },
        complete: () => {
          // Detach the current set overlay
          overlayRef.detach();
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
