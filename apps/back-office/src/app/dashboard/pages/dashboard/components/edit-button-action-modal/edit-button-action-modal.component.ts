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
  DashboardService,
  DataTemplateService,
  EditorControlComponent,
  EditorService,
  Form,
  INLINE_EDITOR_CONFIG,
  Resource,
  ResourceQueryResponse,
  ResourceSelectComponent,
  Role,
  UnsubscribeComponent,
} from '@oort-front/shared';
import {
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
import { filter, iif, of, switchMap, takeUntil } from 'rxjs';
import { RawEditorSettings } from 'tinymce';
import { GET_RESOURCE } from './graphql/queries';

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
  ],
  templateUrl: './edit-button-action-modal.component.html',
  styleUrls: ['./edit-button-action-modal.component.scss'],
})
export class EditButtonActionModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form group */
  form: FormGroup;

  /** Variants */
  public variants = ButtonVariants;
  /** Categories */
  public categories = ButtonCategories;

  /** Is the action new */
  public isNew: boolean;

  /** tinymce href editor */
  public hrefEditor: RawEditorSettings = INLINE_EDITOR_CONFIG;
  /** Roles from current application */
  public roles: Role[];
  /** Record fields current application */
  public recordFields: string[] = [];
  /** Resource template list */
  public templates: Form[] = [];
  /** Selected resource */
  public selectedResource!: Resource;
  /**
   * Map current available fields options to name
   *
   * @param fields current fields array
   * @returns map fields array to name
   */
  private getFields = (fields: any[]) =>
    (fields ?? []).map((f: { name: string }) => f.name);

  /**
   * Component for editing a dashboard button action
   *
   * @param dialogRef dialog reference
   * @param data initial button action
   * @param editorService editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   * @param router Router service
   * @param applicationService shared application service
   * @param fb form builder
   * @param apollo Angular Apollo client
   * @param dashboardService Dashboard service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) data: ButtonActionT,
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    public applicationService: ApplicationService,
    private fb: FormBuilder,
    private apollo: Apollo,
    public dashboardService: DashboardService
  ) {
    super();
    this.roles = this.applicationService.application.value?.roles || [];
    this.form = this.createButtonActionForm(data, this.roles);
    this.isNew = !data;

    // Set the editor base url based on the environment file
    this.hrefEditor.base_url = editorService.url;
    // Set the editor language
    this.hrefEditor.language = editorService.language;
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
              enabled: [!!get(data, 'href', false)],
              previousPage: [false],
              targetUrl: this.fb.group({
                enabled: [!!get(data, 'href', false)],
                href: [get(data, 'href', '')],
                openInNewTab: [get(data, 'openInNewTab', true)],
              }),
            },
            { validator: this.navigateToValidator }
          ),
          editRecord: this.fb.group({
            enabled: [false],
            template: [''],
          }),
          addRecord: this.fb.group(
            {
              enabled: [!!get(data, 'resource', false)],
              resource: [
                get(
                  data,
                  'resource',
                  this.dashboardService.currentSelectedDashboard.page?.context
                    ?.resource ?? ''
                ),
              ],
              template: [get(data, 'template', '')],
              edition: [!!get(data, 'recordFields', false)],
              recordFields: [
                get(
                  data,
                  'recordFields',
                  this.dashboardService.currentSelectedDashboard.page?.context
                    ?.displayField
                    ? [
                        this.dashboardService.currentSelectedDashboard.page
                          ?.context?.displayField,
                      ]
                    : []
                ),
              ],
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
          subscribeToNotification: [false],
          sendNotification: [false],
        },
        { validator: this.actionValidator }
      ),
    });

    // Setting up mutual exclusivity for action controls and navigateTo controls
    const actionControls = [
      form.get('action.navigateTo.enabled'),
      form.get('action.editRecord.enabled'),
      form.get('action.addRecord.enabled'),
      form.get('action.subscribeToNotification'),
      form.get('action.sendNotification'),
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
            this.templates = data.resource.forms ?? [];
            this.recordFields = this.getFields(data.resource.fields);
          },
        });
    }
    /** Fetch email notification list on subscribe to notification is enabled */
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
          this.templates = data.resource.forms ?? [];
          this.recordFields = this.getFields(data.resource.fields);
        },
      });
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
          this.form.get('action.addRecord.recordFields')?.setValue([]);
          this.selectedResource = data?.resource as Resource;
          this.templates = data?.resource?.forms ?? [];
          this.recordFields = this.getFields(data?.resource.fields);
        },
      });
  }

  /**
   * Set all needed form listeners
   */
  private setFormListeners() {
    this.prepareAddRecordFormListeners();
  }

  ngOnInit(): void {
    this.editorService.addCalcAndKeysAutoCompleter(
      this.hrefEditor,
      this.dataTemplateService.getAutoCompleterPageKeys()
    );
    this.setFormListeners();
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
    const mappedData: ButtonActionT = {
      text: this.form.get('general.buttonText')?.value,
      hasRoleRestriction: this.form.get('general.hasRoleRestriction')?.value,
      roles: this.form.get('general.roles')?.value,
      category: this.form.get('general.category')?.value,
      variant: this.form.get('general.variant')?.value,
      href: this.form.get('action.navigateTo.targetUrl.href')?.value,
      openInNewTab: this.form.get('action.navigateTo.targetUrl.openInNewTab')
        ?.value,
      resource: this.form.get('action.addRecord.resource')?.value,
      template: this.form.get('action.addRecord.template')?.value,
      recordFields: this.form.get('action.addRecord.recordFields')?.value,
    };

    this.dialogRef.close(mappedData);
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
        actions.addRecord.enabled ||
        actions.subscribeToNotification ||
        actions.sendNotification;

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
