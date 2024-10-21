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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
  DataTemplateService,
  INLINE_EDITOR_CONFIG,
  ButtonActionT,
  ApplicationService,
  Role,
} from '@oort-front/shared';
import { Router } from '@angular/router';

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

  /**
   * Component for editing a dashboard button action
   *
   * @param dialogRef dialog reference
   * @param data initial button action
   * @param editorService editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   * @param router Router service
   * @param applicationService shared application service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) private data: ButtonActionT,
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    public applicationService: ApplicationService,
    private fb: FormBuilder
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
  }

  /** On click on the preview button open the href */
  public preview(): void {
    let href = this.form.get('href')?.value;
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
    this.dialogRef.close(this.form.value as any);
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
        buttonText: [get(data, 'general.buttonText', ''), Validators.required],
        hasRoleRestriction: [
          get(data, 'general.hasRoleRestriction', false),
          Validators.required,
        ],
        roles: [
          get(
            data,
            'general.roles',
            roles.map((role) => role.id || '')
          ),
        ],
        category: [get(data, 'general.category', 'secondary')],
        variant: [get(data, 'general.variant', 'primary')],
      }),
      action: this.fb.group({
        navigateTo: this.fb.group({
          enabled: [false],
          previousPage: [false],
          targetUrl: this.fb.group({
            enabled: [false],
            href: [''],
            openInNewTab: [true],
          }),
        }),
        editRecord: this.fb.group({
          enabled: [false],
          template: [''],
        }),
        addRecord: [false],
        suscribeToNotification: [false],
        sendNotification: [false],
      }),
    });
    return form;
  };
}
