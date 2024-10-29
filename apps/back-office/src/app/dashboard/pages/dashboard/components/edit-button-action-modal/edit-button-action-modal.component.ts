import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  variants as ButtonVariants,
  categories as ButtonCategories,
  FormWrapperModule,
  SelectMenuModule,
  ButtonModule,
  ToggleModule,
  DividerModule,
  TabsModule,
  IconModule,
  TooltipModule,
} from '@oort-front/ui';
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
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { get } from 'lodash';
import { RawEditorSettings } from 'tinymce';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  EditorService,
  EditorControlComponent,
  DashboardService,
  DataTemplateService,
  INLINE_EDITOR_CONFIG,
  ButtonActionT,
  ApplicationService,
  Role,
  ResourceQueryResponse,
} from '@oort-front/shared';
import { Router } from '@angular/router';
import { Form } from '@oort-front/shared';
import { Apollo } from 'apollo-angular';
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
  ],
  templateUrl: './edit-button-action-modal.component.html',
  styleUrls: ['./edit-button-action-modal.component.scss'],
})
export class EditButtonActionModalComponent implements OnInit {
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

  /** Templates for the resource */
  public templates: Form[] = [];

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
   * @param apollo apollo client
   * @param dashboardService dashboard service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) private data: ButtonActionT,
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    public applicationService: ApplicationService,
    private fb: FormBuilder,
    private apollo: Apollo,
    private dashboardService: DashboardService
  ) {
    this.roles = this.applicationService.application.value?.roles || [];
    this.form = this.createButtonActionForm(data, this.roles);
    this.isNew = !data;

    // Set the editor base url based on the environment file
    this.hrefEditor.base_url = editorService.url;
    // Set the editor language
    this.hrefEditor.language = editorService.language;
  }

  ngOnInit(): void {
    this.editorService.addCalcAndKeysAutoCompleter(
      this.hrefEditor,
      this.dataTemplateService.getAutoCompleterPageKeys()
    );

    // Get the resource templates
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          resource:
            this.dashboardService.currentDashboard.page?.context?.resource ??
            '',
        },
      })
      .subscribe({
        next: ({ data }) => {
          this.templates = data.resource.forms ?? [];
        },
      });
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
    if (!this.form.get('action.navigateTo.enabled')?.value) {
      this.form.get('action.navigateTo.previousPage')?.setValue(false);
      this.form.get('action.navigateTo.targetUrl.enabled')?.setValue(false);
      this.form.get('action.navigateTo.targetUrl.href')?.setValue('');
      this.form
        .get('action.navigateTo.targetUrl.openInNewTab')
        ?.setValue(false);
    }

    if (!this.form.get('action.navigateTo.targetUrl.enabled')?.value) {
      this.form.get('action.navigateTo.targetUrl.href')?.setValue('');
      this.form
        .get('action.navigateTo.targetUrl.openInNewTab')
        ?.setValue(false);
    }

    if (!this.form.get('action.editRecord.enabled')?.value) {
      this.form.get('action.editRecord.template')?.setValue('');
    }

    const mappedData: ButtonActionT = {
      text: this.form.get('general.buttonText')?.value,
      hasRoleRestriction: this.form.get('general.hasRoleRestriction')?.value,
      roles: this.form.get('general.roles')?.value,
      category: this.form.get('general.category')?.value,
      variant: this.form.get('general.variant')?.value,
      href: this.form.get('action.navigateTo.targetUrl.href')?.value,
      openInNewTab: this.form.get('action.navigateTo.targetUrl.openInNewTab')
        ?.value,
      previousPage: this.form.get('action.navigateTo.previousPage')?.value,
      template: this.form.get('action.editRecord.template')?.value,
    };

    this.dialogRef.close(mappedData);
  }

  /**
   * Create a form group for the button action
   *
   * @param data Data to initialize the form
   * @param roles roles of the application
   * @returns the form group
   */
  createButtonActionForm = (data: ButtonActionT, roles: Role[]): FormGroup => {
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
            }
            // { validator: this.navigateToValidator }
          ),
          editRecord: this.fb.group(
            {
              enabled: [!!get(data, 'template', false)],
              template: [get(data, 'template', '')],
            }
            // {
            //   validator: (
            //     control: AbstractControl
            //   ): ValidationErrors | null => {
            //     return control.get('enabled')?.value
            //       ? null
            //       : { atLeastOneRequired: true };
            //   },
            // }
          ),
          addRecord: this.fb.group({
            enabled: [!!get(data, 'addRecord', false)],
            resource: [get(data, 'addRecord.resource', '')],
            template: [get(data, 'addRecord.template', '')],
            editCurrentRecord: [get(data, 'addRecord.editCurrentRecord', true)],
            attachNewToCurrentFields: [
              get(data, 'addRecord.attachNewToCurrentFields', []),
            ],
          }),
          subscribeToNotification: this.fb.group({
            enabled: [false],
          }),
          sendNotification: this.fb.group({
            enabled: [false],
          }),
        }
        // { validator: this.actionValidator }
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
   * Utility function to set up mutual exclusivity for a set of controls
   *
   * @param controls Array of controls to set up mutual exclusivity for
   */
  setupMutualExclusivity = (controls: AbstractControl[]) => {
    controls.forEach((control, index) => {
      control?.valueChanges.subscribe((value: boolean | null) => {
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
