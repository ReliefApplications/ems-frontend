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
  DataTemplateService,
  EditorControlComponent,
  EditorService,
  EmailNotification,
  EmailService,
  INLINE_EDITOR_CONFIG,
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
import { get, isNil } from 'lodash';
import { filter, switchMap, takeUntil } from 'rxjs';
import { RawEditorSettings } from 'tinymce';

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
  /** Email notification list */
  public emailNotifications: EmailNotification[] = [];

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
   * @param emailService Email service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) private data: ButtonActionT,
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    public applicationService: ApplicationService,
    private fb: FormBuilder,
    private emailService: EmailService
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
   * Set all needed form listeners
   */
  private setFormListeners() {
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
      notification: this.form.get('action.subscribeToNotification.notification')
        ?.value,
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
          addRecord: [false],
          subscribeToNotification: this.fb.group(
            {
              enabled: [!!get(data, 'notification', false)],
              notification: [get(data, 'notification', '')],
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
          sendNotification: [false],
        },
        { validator: this.actionValidator }
      ),
    });

    // Setting up mutual exclusivity for action controls and navigateTo controls
    const actionControls = [
      form.get('action.navigateTo.enabled'),
      form.get('action.editRecord.enabled'),
      form.get('action.addRecord'),
      form.get('action.subscribeToNotification.enabled'),
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
        actions.addRecord ||
        actions.subscribeToNotification.enabled ||
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
