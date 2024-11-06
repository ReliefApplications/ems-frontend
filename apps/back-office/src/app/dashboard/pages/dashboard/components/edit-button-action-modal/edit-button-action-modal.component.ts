import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationService,
  ButtonActionT,
  Dashboard,
  DataTemplateService,
  EditorControlComponent,
  EditorService,
  EmailNotification,
  EmailService,
  FieldMapperComponent,
  Form,
  INLINE_EDITOR_CONFIG,
  QueryBuilderModule,
  QueryBuilderService,
  Resource,
  ResourceQueryResponse,
  ResourceSelectComponent,
  Role,
  UnsubscribeComponent,
  addNewField,
} from '@oort-front/shared';
import {
  AlertModule,
  categories as ButtonCategories,
  ButtonModule,
  variants as ButtonVariants,
  DialogModule,
  DividerModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TabsModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Apollo } from 'apollo-angular';
import { get, isNil } from 'lodash';
import { filter, iif, map, of, switchMap, takeUntil } from 'rxjs';
import { RawEditorSettings } from 'tinymce';
import { GET_RESOURCE } from './graphql/queries';

/** Dialog data interface */
interface DialogData {
  button: ButtonActionT;
  dashboard: Dashboard;
}

/** Component for editing a dashboard button action */
@Component({
  selector: 'app-edit-button-action-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    SelectMenuModule,
    ButtonModule,
    ToggleModule,
    EditorModule,
    EditorControlComponent,
    DividerModule,
    TabsModule,
    IconModule,
    TooltipModule,
    ResourceSelectComponent,
    FieldMapperComponent,
    QueryBuilderModule,
    AlertModule,
  ],
  templateUrl: './edit-button-action-modal.component.html',
  styleUrls: ['./edit-button-action-modal.component.scss'],
})
export class EditButtonActionModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form group */
  public form: FormGroup;
  /** Button variants */
  public variants = ButtonVariants;
  /** Button categories */
  public categories = ButtonCategories;
  /** Is the action new */
  public isNew: boolean;
  /** tinymce href editor */
  public hrefEditor: RawEditorSettings = INLINE_EDITOR_CONFIG;
  /** Roles from current application */
  public roles: Role[];
  /** Email notification list */
  public emailNotifications: EmailNotification[] = [];
  /** Resources fields, of current page context resource, if any */
  public resourceFields: any[] = [];
  /** Add record template list */
  public addRecordTemplates: Form[] = [];
  /** Add Record fields */
  public addRecordFields: any[] = [];
  /** Edit record template list */
  public editRecordTemplates: Form[] = [];
  /** Selected resource */
  public selectedResource!: Resource;
  /** Send notification distribution list */
  public sendNotificationDistributionList: any[] = [];
  /** Send notification template list */
  public sendNotificationTemplates: Form[] = [];
  /** Fields, of current page context resource, if any */
  public sendNotificationFields: any[] = [];

  /**
   * Component for editing a dashboard button action
   *
   * @param dialogRef dialog reference
   * @param data Dialog data
   * @param editorService editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   * @param router Router service
   * @param applicationService shared application service
   * @param fb form builder
   * @param emailService Email service
   * @param apollo Angular Apollo client
   * @param queryBuilder Query builder service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    public applicationService: ApplicationService,
    private fb: FormBuilder,
    private emailService: EmailService,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {
    super();
    this.roles = this.applicationService.application.value?.roles || [];
    this.form = this.createButtonActionForm(data.button, this.roles);
    this.isNew = !data.button;

    // Set the editor base url based on the environment file
    this.hrefEditor.base_url = editorService.url;
    // Set the editor language
    this.hrefEditor.language = editorService.language;
  }

  ngOnInit(): void {
    // Build list of pages for autocompletion in navigation settings
    this.editorService.addCalcAndKeysAutoCompleter(
      this.hrefEditor,
      this.dataTemplateService.getAutoCompleterPageKeys()
    );
    // Listen to form changes
    this.setFormListeners();
    // Get context resource data, if any
    if (this.data.dashboard.page?.context?.resource) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            resource: this.data.dashboard.page?.context?.resource,
          },
        })
        .subscribe({
          next: ({ data }) => {
            this.editRecordTemplates = data.resource.forms ?? [];
            this.sendNotificationFields = this.queryBuilder.getFields(
              data.resource?.queryName as string
            );
            this.resourceFields = data.resource.fields.filter((f: any) =>
              ['resource', 'resources'].includes(f.type)
            );
          },
        });
    }
    // Get list of email notifications for application
    if (this.form.get('action.subscribeToNotification.enabled')?.value) {
      this.emailService
        .getEmailNotifications(
          this.applicationService.application?.getValue()?.id as string
        )
        .subscribe({
          next: ({ data }) => {
            this.emailNotifications = data.emailNotifications.edges.map(
              (item) => item.node
            );
          },
        });
    }
    // Get list of distribution list for application
    if (this.form.get('action.sendNotification.enabled')?.value) {
      this.emailService
        .getEmailDistributionList(
          this.applicationService.application?.getValue()?.id as string
        )
        .pipe(
          switchMap(({ data }) => {
            const emailDistributionLists = data.emailDistributionLists;
            return this.emailService
              .getCustomTemplates(
                this.applicationService.application?.getValue()?.id as string
              )
              .pipe(
                map(({ data }) => ({
                  emailDistributionLists,
                  customTemplates: data.customTemplates,
                }))
              );
          })
        )
        .subscribe({
          next: ({ customTemplates, emailDistributionLists }) => {
            this.sendNotificationDistributionList =
              emailDistributionLists.edges.map((item: any) => item.node);
            this.sendNotificationTemplates = customTemplates.edges.map(
              (item: any) => item.node
            );
          },
        });
    }
  }

  /**
   * Create a form group for the button action
   *
   * @param data Data to initialize the form
   * @param roles roles of the application
   * @returns the form group
   */
  private createButtonActionForm = (
    data: ButtonActionT,
    roles: Role[]
  ): FormGroup => {
    const mapping = get(data, 'addRecord.mapping', {}) as {
      [key: string]: any;
    };
    const form = this.fb.group({
      general: this.fb.group({
        buttonText: [get(data, 'text', ''), Validators.required],
        hasRoleRestriction: [
          get(data, 'hasRoleRestriction', false),
          Validators.required,
        ],
        roles: [
          get(
            data,
            'roles',
            roles.map((role) => role.id || '')
          ),
        ],
        category: [get(data, 'category', 'secondary')],
        variant: [get(data, 'variant', 'primary')],
      }),
      action: this.fb.group(
        {
          navigateTo: this.fb.group(
            {
              enabled: [
                !!get(data, 'href', false) || get(data, 'previousPage'),
              ],
              previousPage: [get(data, 'previousPage', false)],
              targetUrl: this.fb.group({
                enabled: [!!get(data, 'href', false)],
                href: [get(data, 'href', '')],
                openInNewTab: [get(data, 'openInNewTab', true)],
              }),
            },
            { validator: this.navigateToValidator }
          ),
          editRecord: this.fb.group({
            enabled: [!!get(data, 'editRecord', false)],
            template: [get(data, 'editRecord.template', '')],
          }),
          addRecord: this.fb.group(
            {
              enabled: [!!get(data, 'addRecord', false)],
              resource: [
                get(
                  data,
                  'addRecord.resource',
                  this.data.dashboard.page?.context?.resource ?? ''
                ),
              ],
              template: [get(data, 'addRecord.template', '')],
              mapping: this.fb.array(
                Object.keys(mapping).map((x: any) =>
                  this.fb.group({
                    name: [x, Validators.required],
                    value: [mapping[x], Validators.required],
                  })
                )
              ),
              rawMapping: [JSON.stringify(mapping, null, 2)],
              edition: [!!get(data, 'addRecord.fieldsForUpdate', false)],
              fieldsForUpdate: [get(data, 'addRecord.fieldsForUpdate', [])],
            },
            {
              validator: (
                control: AbstractControl
              ): ValidationErrors | null => {
                const isEnabledAndHasResourceWithTemplate =
                  control.value.enabled &&
                  control.value.resource !== '' &&
                  !isNil(control.value.resource) &&
                  control.value.template !== '' &&
                  !isNil(control.value.template);
                if (
                  !control.value.enabled ||
                  isEnabledAndHasResourceWithTemplate
                ) {
                  return null;
                }
                return { atLeastOneRequired: true };
              },
            }
          ),
          subscribeToNotification: this.fb.group(
            {
              enabled: [!!get(data, 'subscribeToNotification', false)],
              notification: [
                get(data, 'subscribeToNotification.notification', ''),
              ],
            },
            {
              validator: (control: AbstractControl): ValidationErrors | null =>
                !control.value.enabled ||
                (control.value.notification !== '' &&
                  !isNil(control.value.notification))
                  ? null
                  : { atLeastOneRequired: true },
            }
          ),
          sendNotification: this.fb.group(
            {
              enabled: [!!get(data, 'sendNotification', false)],
              distributionList: [
                get(data, 'sendNotification.distributionList', ''),
              ],
              templates: [get(data, 'sendNotification.templates', [])],
              fields: this.fb.array(
                get(data, 'sendNotification.fields', []).map((x: any) =>
                  addNewField(x)
                )
              ),
            },
            {
              validator: (
                control: AbstractControl
              ): ValidationErrors | null => {
                const isEnabledAndHasDistributionListWithTemplate =
                  control.value.enabled &&
                  control.value.distributionList !== '' &&
                  !isNil(control.value.distributionList) &&
                  !isNil(control.value.templates) &&
                  control.value.templates.length;
                if (
                  !control.value.enabled ||
                  isEnabledAndHasDistributionListWithTemplate
                ) {
                  return null;
                }
                return { atLeastOneRequired: true };
              },
            }
          ),
        },
        { validator: this.actionValidator }
      ),
    });

    // Setting up mutual exclusivity for action controls and navigateTo controls
    const actionControls = [
      form.get('action.navigateTo.enabled'),
      form.get('action.editRecord.enabled'),
      form.get('action.addRecord.enabled'),
      form.get('action.subscribeToNotification.enabled'),
      form.get('action.sendNotification.enabled'),
    ];

    const navigateToControls = [
      form.get('action.navigateTo.previousPage'),
      form.get('action.navigateTo.targetUrl.enabled'),
    ];

    // Apply the utility function to both sets of controls
    this.setupMutualExclusivity(actionControls as AbstractControl[]);
    this.setupMutualExclusivity(navigateToControls as AbstractControl[]);

    return form;
  };

  /**
   * Set needed listeners for add record form
   */
  private prepareAddRecordFormListeners() {
    // Query data on init, if needed
    if (this.form.get('action.addRecord.enabled')?.value) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            resource: this.form.get('action.addRecord.resource')?.value,
          },
        })
        .subscribe({
          next: ({ data }) => {
            this.selectedResource = data.resource;
            this.addRecordTemplates = data.resource.forms ?? [];
            this.addRecordFields = data.resource.fields ?? [];
          },
        });
    }
    // Subscribe to changes on addRecord action to fetch data
    this.form
      .get('action.addRecord.enabled')
      ?.valueChanges.pipe(
        filter((value) => {
          const isFirstEnabled =
            !!value &&
            !this.selectedResource &&
            this.form.get('action.addRecord.resource')?.value;
          return isFirstEnabled;
        }),
        switchMap(() =>
          this.apollo.query<ResourceQueryResponse>({
            query: GET_RESOURCE,
            variables: {
              resource: this.form.get('action.addRecord.resource')?.value,
            },
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ data }) => {
          this.selectedResource = data.resource;
          this.addRecordTemplates = data.resource.forms ?? [];
          this.addRecordFields = data.resource.fields ?? [];
        },
      });
    // Subscribe to changes on addRecord resource to fetch data
    this.form
      .get('action.addRecord.resource')
      ?.valueChanges.pipe(
        switchMap((resource) =>
          iif(
            () => !!resource,
            this.apollo.query<ResourceQueryResponse>({
              query: GET_RESOURCE,
              variables: {
                resource,
              },
            }),
            of({ data: null })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ data }) => {
          this.form.get('action.addRecord.template')?.setValue('');
          this.form.get('action.addRecord.fieldsForUpdate')?.setValue([]);
          this.selectedResource = data?.resource as Resource;
          this.addRecordTemplates = data?.resource?.forms ?? [];
          this.addRecordFields = data?.resource?.fields ?? [];
        },
      });
  }

  /**
   * Set needed listeners for subscribe to notification form
   */
  private prepareSubscribeToNotificationFormListeners() {
    /** Fetch email notification list on subscribe to notification is enabled */
    this.form
      .get('action.subscribeToNotification.enabled')
      ?.valueChanges.pipe(
        filter((value) => !!value),
        switchMap(() =>
          this.emailService.getEmailNotifications(
            this.applicationService.application?.getValue()?.id as string
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ data }) => {
          this.emailNotifications = data.emailNotifications.edges.map(
            (item) => item.node
          );
        },
      });
  }

  /**
   * Set needed listeners for send notification form
   */
  private prepareSendNotificationFormListeners() {
    /** Fetch distribution list on send notification is enabled */
    this.form
      .get('action.sendNotification.enabled')
      ?.valueChanges.pipe(
        filter((value) => !!value),
        switchMap(() =>
          this.emailService.getEmailDistributionList(
            this.applicationService.application?.getValue()?.id as string
          )
        ),
        switchMap(({ data }) => {
          const emailDistributionLists = data.emailDistributionLists;
          return this.emailService
            .getCustomTemplates(
              this.applicationService.application?.getValue()?.id as string
            )
            .pipe(
              map(({ data }) => ({
                emailDistributionLists,
                customTemplates: data.customTemplates,
              }))
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ customTemplates, emailDistributionLists }) => {
          this.sendNotificationDistributionList =
            emailDistributionLists.edges.map((item: any) => item.node);
          this.sendNotificationTemplates = customTemplates.edges.map(
            (item: any) => item.node
          );
        },
      });
  }

  /**
   * Set all needed form listeners
   */
  private setFormListeners() {
    this.prepareAddRecordFormListeners();
    this.prepareSubscribeToNotificationFormListeners();
    this.prepareSendNotificationFormListeners();
  }

  /** On click on the preview button open the href */
  public preview(): void {
    let href = this.form.get('action.navigateTo.targetUrl.href')?.value;
    if (href) {
      //regex to verify if it's a page id key
      const regex = /{{page\((.*?)\)}}/;
      const match = href.match(regex);
      if (match) {
        href = this.dataTemplateService.getButtonLink(match[1]);
      }
      const isNewTab = this.form.get('openInNewTab')?.value ?? true;
      if (isNewTab) window.open(href, '_blank');
      else this.router.navigate([href]);
    }
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    const button: ButtonActionT = {
      text: this.form.get('general.buttonText')?.value,
      hasRoleRestriction: this.form.get('general.hasRoleRestriction')?.value,
      roles: this.form.get('general.roles')?.value,
      category: this.form.get('general.category')?.value,
      variant: this.form.get('general.variant')?.value,
      // If navigateTo enabled
      ...(this.form.get('action.navigateTo.enabled')?.value && {
        previousPage: this.form.get('action.navigateTo.previousPage')?.value,
        // If targetUrl enabled
        ...(this.form.get('action.navigateTo.targetUrl.enabled')?.value && {
          href: this.form.get('action.navigateTo.targetUrl.href')?.value,
          openInNewTab: this.form.get(
            'action.navigateTo.targetUrl.openInNewTab'
          )?.value,
        }),
      }),
      // If editRecord enabled
      ...(this.form.get('action.editRecord.enabled')?.value && {
        editRecord: {
          template: this.form.get('action.editRecord.template')?.value,
        },
      }),
      // If addRecord enabled
      ...(this.form.get('action.addRecord.enabled')?.value && {
        addRecord: {
          resource: this.form.get('action.addRecord.resource')?.value,
          template: this.form.get('action.addRecord.template')?.value,
          fieldsForUpdate: this.form.get('action.addRecord.fieldsForUpdate')
            ?.value,
          mapping:
            this.form.get('action.addRecord.mapping')?.value &&
            this.form.get('action.addRecord.mapping')?.value.length
              ? JSON.parse(this.form.get('action.addRecord.rawMapping')?.value)
              : {},
        },
      }),
      // If subscribeToNotification enabled
      ...(this.form.get('action.subscribeToNotification.enabled')?.value && {
        subscribeToNotification: {
          notification: this.form.get(
            'action.subscribeToNotification.notification'
          )?.value,
        },
      }),
      // If sendNotification enabled
      ...(this.form.get('action.sendNotification.enabled')?.value && {
        sendNotification: {
          distributionList: this.form.get(
            'action.sendNotification.distributionList'
          )?.value,
          templates: this.form.get('action.sendNotification.templates')?.value,
          fields: this.form
            .get('action.sendNotification.fields')
            ?.getRawValue(),
        },
      }),
    };

    this.dialogRef.close(button);
  }

  /**
   * Utility function to set up mutual exclusivity for a set of controls
   *
   * @param controls Array of controls to set up mutual exclusivity for
   */
  setupMutualExclusivity = (controls: AbstractControl[]) => {
    controls.forEach((control, index) => {
      control?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: boolean | null) => {
          if (value) {
            controls.forEach((otherControl, otherIndex) => {
              if (index !== otherIndex) {
                otherControl?.setValue(false, { emitEvent: false });
              }
            });
          }
        });
    });
  };

  /**
   * Validator to ensure that at least one action is enabled
   *
   * @param control form group
   * @returns validation errors
   */
  actionValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const actions = control.value;
    if (actions) {
      const atLeastOneEnabled =
        actions.navigateTo?.enabled ||
        actions.editRecord?.enabled ||
        actions.addRecord?.enabled ||
        actions.subscribeToNotification?.enabled ||
        actions.sendNotification?.enabled;

      return atLeastOneEnabled ? null : { atLeastOneRequired: true };
    }
    return { atLeastOneRequired: true };
  };

  /**
   * Validator to ensure that at least one navigateTo action is enabled
   *
   * @param control form group
   * @returns validation errors
   */
  navigateToValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const navigateTo = control.value;
    if (navigateTo?.enabled) {
      const atLeastOneEnabled =
        navigateTo.previousPage || navigateTo.targetUrl?.enabled;
      const hrefValid =
        !navigateTo.targetUrl?.enabled ||
        (navigateTo.targetUrl.enabled && navigateTo.targetUrl.href);
      if (!atLeastOneEnabled) return { atLeastOneRequired: true };
      if (!hrefValid) return { hrefRequired: true };
    }
    return null;
  };
}
