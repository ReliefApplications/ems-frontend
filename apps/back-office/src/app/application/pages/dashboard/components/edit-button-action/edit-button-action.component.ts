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
} from '@oort-front/ui';
import {
  FormControl,
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
  SafeEditorService,
  SafeEditorControlComponent,
  DataTemplateService,
  INLINE_EDITOR_CONFIG,
  ButtonActionT,
} from '@oort-front/safe';
import { Router } from '@angular/router';

/**
 * Create a form group for the button action
 *
 * @param data Data to initialize the form
 * @returns the form group
 */
const createButtonActionForm = (data?: ButtonActionT) => {
  return new FormGroup({
    text: new FormControl(get(data, 'text', ''), Validators.required),
    href: new FormControl(get(data, 'href', ''), Validators.required),
    variant: new FormControl(get(data, 'variant', 'primary')),
    category: new FormControl(get(data, 'category', 'secondary')),
    openInNewTab: new FormControl(get(data, 'openInNewTab', true)),
  });
};

/** Component for editing a dashboard button action */
@Component({
  selector: 'app-edit-button-action',
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
    SafeEditorControlComponent,
    DividerModule,
  ],
  templateUrl: './edit-button-action.component.html',
  styleUrls: ['./edit-button-action.component.scss'],
})
export class EditButtonActionComponent implements OnInit {
  public form: ReturnType<typeof createButtonActionForm>;

  public variants = ButtonVariants;
  public categories = ButtonCategories;

  public isNew: boolean;

  /** tinymce href editor */
  public hrefEditor: RawEditorSettings = INLINE_EDITOR_CONFIG;

  /**
   * Component for editing a dashboard button action
   *
   * @param dialogRef dialog reference
   * @param data initial button action
   * @param editorService editor service used to get main URL and current language
   * @param dataTemplateService Shared data template service
   * @param router Router service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT>,
    @Inject(DIALOG_DATA) private data: ButtonActionT,
    private editorService: SafeEditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router
  ) {
    this.form = createButtonActionForm(data);
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
}
